export type PageRectangle =
  | "LETTER"
  | "TABLOID"
  | "LEGAL"
  | "A0"
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "A5"
  | "A6";

export type PageOrientation = "landscape" | "portrait";

export type Direction = "vertical" | "horizontal";

export type PageItem = {
  id: string;
  title: string;
  children: PageItem["id"][] | undefined;
  direction?: Direction;
  cat?: string;
  value?: string;

  pluginId?: string;

  horizontal?: "left" | "center" | "right";
  vertical?: "top" | "middle" | "bottom";

  /** text and image **/
  isHyperlink?: boolean;
  hyperlinkUri?: string;

  /** placeholder **/

  /** text **/
  fontSize?: number;
  font?: string;
  fontColor?: string;
  background?: string;
  indent?: boolean;
  bold?: boolean;

  /** image **/
  width?: number;
  height?: number;
  origWidth?: number;
  origHeight?: number;

  pTop?: number;
  pRight?: number;
  pBottom?: number;
  pLeft?: number;

  /** hbox **/
  wildStar?: boolean;
  canShrink?: boolean;
  canGrow?: boolean;
  flexValue?: number;
  flexUnit?: "%" | "px";

  /** table **/
  columns?: any[];
  bindings?: any;
  bindingColumns?: any;
  gap?: "compact" | "normal" | "loose";
};

export interface PageData {
  // 唯一标识
  id: string;
  name?: string;

  /** ------ PageRoot ------ **/
  rectangle: PageRectangle;
  orientation: PageOrientation;
  /** Margin **/
  mTop: number;
  mRight: number;
  mBottom: number;
  mLeft: number;

  defaultPageRootFont: string;
  defaultPageRootFontSize: number;
  defaultPageRootFontColor: string;
  defaultPageRootBackgroundColor: string;

  /** ------ PageHeader ------ **/
  /** Margin **/
  mTopHeader: number;
  mRightHeader: number;
  mBottomHeader: number;
  mLeftHeader: number;
  hideHeaderOnFirstPage: boolean;

  /** ------ PageFooter ------ **/
  /** Margin **/
  mTopFooter: number;
  mRightFooter: number;
  mBottomFooter: number;
  mLeftFooter: number;
  hideFooterOnFirstPage: boolean;

  /** ------ PageBody ------ **/
  /** Margin **/
  mTopBody: number;
  mRightBody: number;
  mBottomBody: number;
  mLeftBody: number;

  /** ------ Content ------ **/
  pageHeaderContent: [PageItem["id"], PageItem][];
  pageBodyContent: [PageItem["id"], PageItem][];
  pageFooterContent: [PageItem["id"], PageItem][];
}

export interface WatermarkOptions {
  watermarkEnabled: boolean;
  watermarkText: string;
  watermarkFontSize: number;
  watermarkFontColor: string;
  watermarkOpacity: number;
  watermarkRotation: number;
}

export interface PageNumberConfigOptions {
  pageNumberLeadingEnabled: boolean;
  pageNumberLeading: number;
  pageNumberCountEnabled: boolean;
  pageNumberCount: number;
}

export interface ContentData {
  config: {
    watermark: WatermarkOptions;
    page: PageNumberConfigOptions;
  };
  pages: PageData[];
  currentPageIndex?: number;
}

export interface StorePageData
  extends Omit<
    PageData,
    "pageHeaderContent" | "pageBodyContent" | "pageFooterContent"
  > {
  pageHeaderContent: Map<PageItem["id"], PageItem>;
  pageBodyContent: Map<PageItem["id"], PageItem>;
  pageFooterContent: Map<PageItem["id"], PageItem>;
}

export interface Store extends Omit<ContentData, "pages" | "currentPageIndex"> {
  pages: StorePageData[];
  currentPageIndex: number;
  currentPageHeaderContent: Map<PageItem["id"], PageItem>;
  currentPageBodyContent: Map<PageItem["id"], PageItem>;
  currentPageFooterContent: Map<PageItem["id"], PageItem>;
  setCurrentPageIndex: (index: number) => void;
  setCurrentPageAndContent: (
    pageIndex: number,
    content: Map<PageItem["id"], PageItem>,
    position: "header" | "body" | "footer",
  ) => void;
  updateTextItemValue: (
    itemId: string,
    newValue: string,
    position?: "header" | "body" | "footer",
  ) => void;
  updatePluginItemProps: (
    itemId: string,
    newProps: any,
    position?: "header" | "body" | "footer",
  ) => void;
  updatePageName: (pageIndex: number, name: string) => void;
  updatePageRectangle: (pageIndex: number, rectangle: PageRectangle) => void;
  updatePageOrientation: (
    pageIndex: number,
    orientation: PageOrientation,
  ) => void;
  updatePageBodyMargin: (
    pageIndex: number,
    paddingType: "mLeftBody" | "mRightBody" | "mTopBody" | "mBottomBody",
    value: number,
  ) => void;
  updatePageHeaderMargin: (
    pageIndex: number,
    marginType: "mLeftHeader" | "mRightHeader" | "mTopHeader" | "mBottomHeader",
    value: number,
  ) => void;
  updatePageFooterMargin: (
    pageIndex: number,
    marginType: "mLeftFooter" | "mRightFooter" | "mTopFooter" | "mBottomFooter",
    value: number,
  ) => void;
  addPage: (afterIndex: number, pageData: StorePageData) => void;
  addPageAfterCurrent: () => void;
  deletePage: (pageIndex: number) => void;
}
