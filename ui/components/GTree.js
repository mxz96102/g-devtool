import { Drawer, Empty, Space, Tree } from 'antd';
import React, {useState, useEffect} from 'react';
import ReactJson from 'react-json-view';
import {BlockOutlined, PrinterOutlined, AppstoreOutlined } from '@ant-design/icons'

const iconMap = {
  group: <BlockOutlined />,
  renderer: <PrinterOutlined />,
  shape: <AppstoreOutlined />
}

const AttrsDrawer = ({ hash, getAttrs, onCancel, updateAttrs }) => {
  const [val, setVal] = useState(hash);
  const change = (all) => { const { updated_src, namespace, name } = all; updateAttrs(hash, namespace[0] || name, updated_src[namespace[0] || name] , all) }

  useEffect(() => {
    if (hash && getAttrs) {
      getAttrs(hash).then(res => {
        setVal(res)
      })
    } else {
      onCancel();
      getAttrs();
    }
  }, [hash])

  return <Drawer mask={false} onClose={onCancel} visible={hash}>
    <ReactJson style={{ fontSize: 12 }} onAdd={change} onEdit={change} onDelete={change} src={val} />
  </Drawer>
}

const buildTreeData = (data = {}, isRoot) => {
  const node = {
    title: data.type,
    type: data.type === 'group' ? 'group' : 'shape',
    key: data.hash
  }
  

  if (data.children) {
    node.children = data.children.map(e => buildTreeData(e))
  }

  if (isRoot) {
    return {
      title: 'renderer',
      type: 'renderer',
      children: [node]
    }
  }

  return node;
}

const GTree = (props) => {
  const { data, actions = {} } = props;
  const [selectedKey, setSelected] = useState()

  if (!data) {
    return <Empty />
  }

  const treeData = buildTreeData(data, true);


  return <div>
    <Tree selectedKeys={[selectedKey]}  onSelect={(keys) => setSelected(keys[0])} defaultExpandAll showLine={{ showLeafIcon: false }} titleRender={(node) => <div onMouseEnter={() => { actions.showRect(node.key) }} onMouseLeave={() => {actions.cleanRect()}}><Space>{iconMap[node.type]}{node.title}</Space></div>}  treeData={[treeData]} />
    <AttrsDrawer hash={selectedKey} onCancel={() => setSelected()} getAttrs={actions.getAttrs} updateAttrs={actions.updateAttrs} />
    </div>
}

export default GTree;
