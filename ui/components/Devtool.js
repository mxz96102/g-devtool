import React, {useState} from 'react';
import { Select } from 'antd'
import GTree from './GTree';

const Devtool = (props) => {
  const { data = [], actions={} } = props;
  const [selectedData, setSelectedData] = useState();



  return <div>
    <Select options={data.map((e, i) => ({
      label: `Canvas ${i}`,
      value: i,
      info: e
    }))} onChange={(_, opt) => {setSelectedData(opt ? opt.info : undefined)}} placeholder="Choose a canvas to inspect" style={{ width: '100%' }} />
    <GTree actions={actions} data={selectedData} />
  </div>
}

export default Devtool;
