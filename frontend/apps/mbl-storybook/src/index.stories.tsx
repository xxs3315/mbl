import { MixBoxLayout } from "@xxs3315/mbl-lib";
import { contents } from "@xxs3315/mbl-lib-example-data";
import "@xxs3315/mbl-lib/index.css";

import React from "react";
import { Foo } from "./components/foo";

export default {
  title: "Index",
};

export const Local = () => <Foo />;

export const MyMixBoxLayout = () => (
  <MixBoxLayout id={"storybook-demo"} contents={contents} />
);
