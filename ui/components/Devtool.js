import React, { useState } from "react";
import { Row, Select, Col, Button, Tooltip } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import GTree from "./GTree";

const HeadBar = (props) => {
  const { data, setSelectedData, actions, selectedData } = props;
  return (
    <Row
      style={{
        padding: 2,
        marginBottom: 6,
        borderBottom: "1px solid #ddd",
        background: "rgba(0, 0, 0, 0.05)",
      }}
      gutter={[12, 12]}
    >
      <Col>
        <Select
          bordered={false}
          size="small"
          defaultValue={0}
          options={data.map((e, i) => ({
            label: `Canvas ${i}`,
            value: i,
            info: e,
          }))}
          onChange={(_, opt) => {
            setSelectedData(opt ? opt.info : undefined);
          }}
          placeholder="Choose a canvas to inspect"
          style={{ width: "100%" }}
        />
      </Col>
      <Col flex={1}></Col>
      <Col>
        <Button
          size="small"
          type="text"
          onClick={() => {
            actions.consoleEl(selectedData.hash);
          }}
        >
          <Tooltip arrowPointAtCenter title="Console G Canvas">
            <CodeOutlined />
          </Tooltip>
        </Button>
      </Col>
    </Row>
  );
};

const Devtool = (props) => {
  const { data = [], actions = {} } = props;
  const [selectedData, setSelectedData] = useState(data[0]);

  return (
    <div>
      <HeadBar
        data={data}
        setSelectedData={setSelectedData}
        selectedData={selectedData}
        actions={actions}
      />
      <GTree actions={actions} data={selectedData} />
    </div>
  );
};

export default Devtool;
