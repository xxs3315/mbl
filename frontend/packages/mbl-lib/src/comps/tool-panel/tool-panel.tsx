import { Accordion, Avatar, Group, Tabs, Text } from "@mantine/core";
import { Box } from "@xxs3315/mbl-dnd";
import "@xxs3315/mbl-dnd/box.css";
import { toolPanelComps } from "./data";
import React from "react";
import { css } from "../../styled-system/css";

interface ToolPanelCompProp {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  image: string;
  items?: any;
}

interface ToolPanelDataBindingProp {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  image: string;
  shape: "list" | "scatter";
  request: string;
  value: any;
  bindings: any;
  type?: string;
}

export type ToolPanelDataBindingPayload = ToolPanelDataBindingProp &
  Partial<{ onClick: (id?: string) => void }>;

export type ToolPanelCompPayload = ToolPanelCompProp &
  Partial<{ onClick: (id?: string) => void }>;

interface AccordionCompLabelProps {
  name: string;
  image: string;
  abbreviation: string;
  description: string;
}

interface AccordionDataBindLabelProps {
  name: string;
  image: string;
  abbreviation: string;
  description: string;
  type?: string;
  request: string;
  shape: string;
}

function AccordionCompLabel({
  name,
  image,
  description,
  abbreviation,
}: AccordionCompLabelProps) {
  return (
    <Group wrap="nowrap">
      <Avatar radius="xl" size="md">
        {abbreviation}
      </Avatar>
      <div>
        <Text>{name}</Text>
        <Text size="xs" c="dimmed" fw={400}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

function AccordionDataBindingLabel({
  name,
  image,
  description,
  abbreviation,
  shape,
  request,
}: AccordionDataBindLabelProps) {
  return (
    <Group wrap="nowrap">
      <Avatar radius="xl" size="md">
        {abbreviation}
      </Avatar>
      <div>
        <Text>{name}</Text>
        <Text size="xs" c="dimmed" fw={400}>
          {description}(
          {shape === "list" ? "toolPanel.list" : "toolPanel.object"}-
          {request === "url" ? "toolPanel.remoteUrl" : "toolPanel.localData"})
        </Text>
        <Text size="xs" className={css({ display: "none" })}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

const ToolPanel = () => {
  const controlItems = toolPanelComps.map((panel, index) => {
    return (
      <Accordion.Item value={panel.id} key={panel.id}>
        <Accordion.Control>
          <AccordionCompLabel {...panel} />
        </Accordion.Control>
        <Accordion.Panel>
          <div
            className={css({
              marginX: "0.2",
              marginY: "0.2",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.2",
              textAlign: "center",
              fontSize: "xs",
            })}
          >
            {panel.items?.map((item: any, itemIndex: number) => (
              <Box
                name={item.name}
                type={item.type}
                cat={item.cat}
                attrs={item.attrs}
                isDropped={false}
                key={`${index}${itemIndex}`}
              />
            ))}
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  // const dataBindingItems = toolPanelDataBindings.map((panel, index) => {
  //   return (
  //     <Accordion.Item value={panel.id} key={panel.id}>
  //       <Accordion.Control>
  //         <Box
  //           name={panel.name}
  //           type={
  //             panel.shape === "scatter"
  //               ? ItemTypes.BINDING_SCATTER
  //               : ItemTypes.BINDING
  //           }
  //           cat={"binding"}
  //           attrs={null}
  //           isDropped={false}
  //           key={`${index}${panel.id}`}
  //           id={panel.id}
  //           value={panel.value}
  //           request={panel.request}
  //           shape={panel.shape}
  //         >
  //           <AccordionDataBindingLabel {...panel} />
  //         </Box>
  //       </Accordion.Control>
  //       <Accordion.Panel>
  //         <div className={css({
  //           marginX: "0.5",
  //           marginY: "0.5",
  //           display: "grid",
  //           gridTemplateColumns: "repeat(4, 1fr)",
  //           gap: "0.5",
  //           textAlign: "center",
  //           fontSize: "xs"
  //         })}>
  //           {panel.bindings?.map((item: any, itemIndex: number) => (
  //             <Box
  //               name={item.name}
  //               type={
  //                 panel.shape === "scatter"
  //                   ? ItemTypes.BINDING_ITEM_SCATTER
  //                   : ItemTypes.BINDING_ITEM
  //               }
  //               cat={item.cat}
  //               attrs={item.attrs}
  //               isDropped={false}
  //               key={`${index}${itemIndex}`}
  //               bind={item.bind}
  //             />
  //           ))}
  //         </div>
  //       </Accordion.Panel>
  //     </Accordion.Item>
  //   );
  // });

  const controlsTab = () => {
    return <Accordion chevronPosition="right">{controlItems}</Accordion>;
  };

  // const dataBindingsTab = () => {
  //   return <Accordion chevronPosition="right">{dataBindingItems}</Accordion>;
  // };

  return (
    <Tabs defaultValue="components">
      <Tabs.List>
        <Tabs.Tab value="components">{"组件"}</Tabs.Tab>
        <Tabs.Tab value="data-binding">{"数据"}</Tabs.Tab>
        {/* <Tabs.Tab value="theme">{"theme.settings"}</Tabs.Tab> */}
      </Tabs.List>

      <Tabs.Panel value="components">{controlsTab()}</Tabs.Panel>

      {/*<Tabs.Panel value="data-binding">{dataBindingsTab()}</Tabs.Panel>*/}

      {/* <Tabs.Panel value="theme">
				<ThemePanel />
			</Tabs.Panel> */}
    </Tabs>
  );
};

export default ToolPanel;
