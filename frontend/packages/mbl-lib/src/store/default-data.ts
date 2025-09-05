// 示例：ContentData 格式的完整页面数据
import { ContentData } from "@xxs3315/mbl-typings";

export const defaultContents: ContentData = {
  config: {
    watermark: {
      watermarkEnabled: false,
      watermarkText: "水印文字",
      watermarkFontSize: 24,
      watermarkFontColor: "#cccccc",
      watermarkOpacity: 0.3,
      watermarkRotation: -45,
    },
    page: {
      pageNumberLeadingEnabled: false,
      pageNumberLeading: 0,
      pageNumberCountEnabled: false,
      pageNumberCount: 0,
    },
  },
  currentPageIndex: 0,
  pages: [
    {
      id: "1",

      rectangle: "A4",
      orientation: "portrait",

      mTop: 50,
      mRight: 40,
      mBottom: 50,
      mLeft: 40,

      mTopHeader: 15,
      mRightHeader: 15,
      mBottomHeader: 15,
      mLeftHeader: 15,
      hideHeaderOnFirstPage: false,

      mTopFooter: 15,
      mRightFooter: 15,
      mBottomFooter: 15,
      mLeftFooter: 15,
      hideFooterOnFirstPage: false,

      defaultPageRootFont: "simfang",
      defaultPageRootFontSize: 10,
      defaultPageRootFontColor: "#000000",
      defaultPageRootBackgroundColor: "#00000000",

      mTopBody: 15,
      mRightBody: 15,
      mBottomBody: 15,
      mLeftBody: 15,

      pageHeaderContent: [
        [
          "page-header-root",
          {
            id: "page-header-root",
            title: "",
            children: [],
            cat: "container",
            direction: "vertical",
          },
        ],
      ],

      pageBodyContent: [
        [
          "page-body-root",
          {
            id: "page-body-root",
            title: "",
            children: [],
            cat: "container",
            direction: "vertical",
          },
        ],
      ],

      pageFooterContent: [
        [
          "page-footer-root",
          {
            id: "page-footer-root",
            title: "",
            children: [],
            cat: "container",
            direction: "vertical",
          },
        ],
      ],
    },
  ],
};
