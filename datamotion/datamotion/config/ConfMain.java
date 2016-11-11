package datamotion.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import oracle.net.ano.Ano;

import org.apache.log4j.Logger;

import com.platform.config.run.BaseConfMain;

import csuduc.platform.util.ComUtil;
import csuduc.platform.util.StringUtil;
import datamotion.common.MdlTreeProperty;
import datamotion.mvc.mdlcomm.MdlClientTreeChecked;
import datamotion.mvc.t11_initfoldertree.T11_initfoldertree;
import datamotion.mvc.t11_initfoldertree.T11_initfoldertreeService;
import datamotion.mvc.t12_initmodule.T12_initmodule;
import datamotion.mvc.t12_initmodule.T12_initmoduleService;
import datamotion.mvc.t_kvalue.T_kvalue;
import datamotion.mvc.t_kvalue.T_kvalueService;

/**  
 * 创建时间：2016年1月26日 上午11:13:45  
 * 项目名称：DUCPlatFormWeb   
 * 文件名称：ConfMain.java  
 * 类说明：  
 *
 * Modification History:   
 * Date        Author         Version      Description   
 * ----------------------------------------------------------------- 
 * 2016年1月26日     Zhongweng       1.0         1.0 Version   
 */

/**
 * <p>
 * Title: ConfMain<／p>
 * <p>
 * Description: <／p>
 * 
 * @author ZhongwengHao
 * @date 2016年11月8日
 */
public class ConfMain extends BaseConfMain {
	private static Logger log = Logger.getLogger(ConfMain.class);
	private final static ConfMain single = new ConfMain();
	public static MdlTreeProperty treeRoot ;
	public static Map<String, T11_initfoldertree> mapInitfoldertrees = new HashMap<String, T11_initfoldertree>();
	public static Map<String, T12_initmodule> mapInitmodules = new HashMap<String, T12_initmodule>();
	public static Map<String, T_kvalue> mapKValues = new HashMap<String, T_kvalue>();
	public static Map<String, T12_initmodule> mapProperty = new HashMap<String, T12_initmodule>();
	public static Map<String, MdlTreeProperty> mapTreeProperty = new HashMap<String, MdlTreeProperty>();

	public static ConfMain getInstance() {
		return single;
	}

	/**
	 * <p>
	 * Title: buildProperties<／p>
	 * <p>
	 * Description: 加载模块配置信息 <／p>
	 * 
	 * @return
	 */
	public static boolean buildProperties() {

		if (!loadFolderTree() || !loadModules() || !loadKValue()) {
			return false;
		}
		if (!buildTree()) {
			return false;
		}
		//设置treeRoot
		treeRoot = mapTreeProperty.get("0");
		treeRoot.nameEngPath = ""; 
		if (!buildTreeModules(treeRoot)) {
			return false;
		}
		
		return true;
	}

	/**
	 * <p>Title: buildTree<／p>
	 * <p>Description: 
	 * 组建树结构
	 * <／p>
	 * @return
	 */
	public static boolean buildTree() {
		
		// 构建树
		for (Map.Entry<String, T11_initfoldertree> item : mapInitfoldertrees
				.entrySet()) {

			MdlTreeProperty treeProperty = mapTreeProperty.get(item.getKey());
			if (null == treeProperty) {
				treeProperty = new MdlTreeProperty();
				// 本身
				treeProperty.self = item.getValue();
				
				mapTreeProperty.put(item.getKey(), treeProperty);
			}

			// 孩子关联
			String childrenKeysStr = treeProperty.self.getChildkeys();
			if (!ComUtil.isEmptyStr(childrenKeysStr)) {
				List<String> childrenKeys = StringUtil.split(childrenKeysStr,
						'-');
				for (String child : childrenKeys) {
					MdlTreeProperty childTreeProperty = mapTreeProperty
							.get(child);
					if (null == childTreeProperty) {
						childTreeProperty = new MdlTreeProperty();
						// 本身
						childTreeProperty.self = mapInitfoldertrees.get(child);
						mapTreeProperty.put(child, childTreeProperty);
						
						// 父子关系
						childTreeProperty.parent = treeProperty;
						
					}
					// 添加孩子
					treeProperty.children.put(child, childTreeProperty);
				}
			}

		}

		return true;
	}

	
	/**
	 * <p>Title: buildTreeModules<／p>
	 * <p>Description: 
	 * 组建树结构的配置文件
	 * 如果叶子节点没有配置信息，则用最近的父节点的配置
	 * <／p>
	 * @return
	 */
	public static boolean buildTreeModules(MdlTreeProperty aNode){
		
		String fkeyModule = aNode.self.getFkeyinitmodule();
		if (!ComUtil.isEmptyStr(fkeyModule)) {
			//不为空 则直接使用本身的设置
			T12_initmodule property = mapInitmodules.get(fkeyModule);
			if (null == property) {
				//有误，有外键 但是没有实体
				log.error(String.format("buildTreeModules fkeyModule:%s null == property",fkeyModule));
				//则采用父类的属性
				aNode.property = aNode.parent.property;
			}else {
				aNode.property = property;
			}
		}else {
			//自己本身没有设置 则采用父 属性
			aNode.property = aNode.parent.property;
		}
		//设置英文缩写
		aNode.nameEng = mapKValues.get(aNode.self.getNamechi()).getValue_();
		//以英文路径做map直接找配置文件
		mapProperty.put(aNode.nameEngPath, aNode.property);
		
		//处理孩子节点的属性
		if (!ComUtil.isEmptyMap(aNode.children)) {
			//有孩子
			for (Map.Entry<String, MdlTreeProperty> iChild : aNode.children.entrySet()) {
				//设置孩子英文路径
				iChild.getValue().nameEngPath = aNode.nameEngPath
						+"_"
						+ iChild.getValue().nameEng;
				
				buildTreeModules(iChild.getValue());
				
			}
		}
		
		return true;
	}
	/**
	 * <p>
	 * Title: loadFolderTree<／p>
	 * <p>
	 * Description: 加载目录树 <／p>
	 * 
	 * @return
	 */
	public static boolean loadFolderTree() {
		try {
			List<T11_initfoldertree> list = T11_initfoldertreeService.service
					.getList();

			if (list == null || list.size() == 0) {
				return false;
			}

			// 添加到map
			for (T11_initfoldertree item : list) {
				mapInitfoldertrees.put((String) item.getKey_(), item);
			}

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}

		return true;
	}

	/**
	 * <p>Title: loadModules<／p>
	 * <p>Description: 
	 * 加载模块配置文件
	 * <／p>
	 * @return
	 */
	public static boolean loadModules() {
		try {
			List<T12_initmodule> list = T12_initmoduleService.service.getList();
			if (null == list || 0 == list.size()) {
				return false;
			}
			for (T12_initmodule item : list) {
				mapInitmodules.put((String) item.getKey_(), item);
			}

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * <p>Title: loadKValue<／p>
	 * <p>Description: 
	 * 加载键值表
	 * <／p>
	 * @return
	 */
	public static boolean loadKValue() {
		try {
			List<T_kvalue> list = T_kvalueService.service.getList();
			if (null == list || 0 == list.size()) {
				return false;
			}
			for (T_kvalue item : list) {
				mapKValues.put((String) item.getKey_(), item);
			}

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
		return true;
	}

}
