import React, {useState} from 'react';
import { Select } from 'antd'
import GTree from './GTree';

const Devtool = (props) => {
  const { data = [], actions={} } = props;
  const [selectedData, setSelectedData] = useState(data[0]);

  return <div>
    <Select defaultValue={0} options={data.map((e, i) => ({
      label: `Canvas ${i}`,
      value: i,
      info: e
    }))} onChange={(_, opt) => {setSelectedData(opt ? opt.info : undefined)}} placeholder="Choose a canvas to inspect" style={{ width: '100%' }} />
    <GTree actions={actions} data={selectedData} />
  </div>
}

export default Devtool;
