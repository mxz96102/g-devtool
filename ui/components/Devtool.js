import React, { useState, useEffect } from "react";
import { Row, Select, Col, Button, Tooltip, Tag } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import GTree from "./GTree";

const HeadBar = (props) => {
  const { data, setSelectedData, actions, selectedData, setData } = props;
  const [canvasAlive, setCanvasAlive] = useState(true);
  
  useEffect(() => {
    const itv = setInterval(() => {
      actions.checkCanvasAlive(selectedData.hash).then(
        res => {
          setCanvasAlive(res);
        }
      )
    }, 1000);

    return () => {
      clearInterval(itv)
    }
  }, [actions, setData, selectedData]);

  useEffect(() => {
    if (!canvasAlive) {
      actions.getNowCanvasData().then(d => {
        if (d) {
          setData(d);
          setSelectedData(d[0])
        }
      })
    }
  }, [canvasAlive])

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
      {
        canvasAlive ? <Col><Tag color="green">ALIVE</Tag></Col> : <Col>
          <Tag color="red">DEAD</Tag><span>Trying to reconnect</span>
        </Col>
      }
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
  const { data: initData = [] , actions = {} } = props;
  const [selectedData, setSelectedData] = useState(initData[0]);
  const [data, setData] = useState(initData);

  useEffect(() => {
    return () => {
      actions.cleanAllRect()
    }
  }, [])

  return (
    <div>
      <HeadBar
        data={data}
        setSelectedData={setSelectedData}
        selectedData={selectedData}
        actions={actions}
        setData={setData}
      />
      <GTree actions={actions} data={selectedData} />
    </div>
  );
};

export default Devtool;
