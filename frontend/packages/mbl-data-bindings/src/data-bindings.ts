interface ToolPanelDataBindingProp {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  image: string;
  shape: "list" | "object";
  request: string;
  value: any;
  bindings: any;
  type?: string;
}

export type ToolPanelDataBindingPayload = ToolPanelDataBindingProp &
  Partial<{ onClick: (id?: string) => void }>;

export const toolPanelDataBindings: ToolPanelDataBindingPayload[] = [
  {
    id: "test1",
    name: "测试数据绑定示例1",
    description: "绑定一个远程json数组",
    abbreviation: "测1",
    image: "测1",
    shape: "list",
    request: "url",
    value: "https://jsonplaceholder.typicode.com/posts",
    bindings: [
      { name: "序号", bind: "id" },
      { name: "用户", bind: "userId" },
      { name: "名称", bind: "title" },
      { name: "内容", bind: "body" },
    ],
  },
  {
    id: "test2",
    name: "测试数据绑定示例2",
    description: "绑定一个静态json数组",
    abbreviation: "测2",
    image: "测2",
    shape: "list",
    request: "data",
    value: `[
			{
				"userId": 3,
				"id": 23,
				"title": "maxime id vitae nihil numquam",
				"body": "veritatis unde neque eligendi quae quod architecto quo neque vitae est illo sit tempora doloremque fugit quod et et vel beatae sequi ullam sed tenetur perspiciatis"
			},
			{
				"userId": 3,
				"id": 24,
				"title": "autem hic labore sunt dolores incidunt",
				"body": "enim et ex nulla omnis voluptas quia qui voluptatem consequatur numquam aliquam sunt totam recusandae id dignissimos aut sed asperiores deserunt"
			},
			{
				"userId": 3,
				"id": 25,
				"title": "rem alias distinctio quo quis",
				"body": "ullam consequatur ut omnis quis sit vel consequuntur ipsa eligendi ipsum molestiae et omnis error nostrum molestiae illo tempore quia et distinctio"
			},
			{
				"userId": 3,
				"id": 26,
				"title": "est et quae odit qui non",
				"body": "similique esse doloribus nihil accusamus omnis dolorem fuga consequuntur reprehenderit fugit recusandae temporibus perspiciatis cum ut laudantium omnis aut molestiae vel vero"
			},
			{
				"userId": 3,
				"id": 27,
				"title": "quasi id et eos tenetur aut quo autem",
				"body": "eum sed dolores ipsam sint possimus debitis occaecati debitis qui qui et ut placeat enim earum aut odit facilis consequatur suscipit necessitatibus rerum sed inventore temporibus consequatur"
			},
			{
				"userId": 3,
				"id": 28,
				"title": "delectus ullam et corporis nulla voluptas sequi",
				"body": "non et quaerat ex quae ad maiores maiores recusandae totam aut blanditiis mollitia quas illo ut voluptatibus voluptatem similique nostrum eum"
			},
			{
				"userId": 3,
				"id": 29,
				"title": "iusto eius quod necessitatibus culpa ea",
				"body": "odit magnam ut saepe sed non qui tempora atque nihil accusamus illum doloribus illo dolor eligendi repudiandae odit magni similique sed cum maiores"
			}
		]`,
    bindings: [
      { name: "序号", bind: "id" },
      { name: "用户", bind: "userId" },
      { name: "名称", bind: "title" },
      { name: "内容", bind: "body" },
    ],
  },
  {
    id: "test3",
    name: "测试数据绑定示例3",
    description: "绑定一个远程json对象",
    abbreviation: "测3",
    image: "测3",
    shape: "object",
    request: "url",
    value: "https://jsonplaceholder.typicode.com/posts/1",
    bindings: [
      { name: "序号", bind: "id" },
      { name: "用户", bind: "userId" },
      { name: "名称", bind: "title" },
      { name: "内容", bind: "body" },
    ],
  },
  {
    id: "test4",
    name: "测试数据绑定示例4",
    description: "绑定一个静态json对象",
    abbreviation: "测4",
    image: "测4",
    shape: "object",
    request: "data",
    value: `{
		  "userId": 1,
		  "id": 1,
		  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
		  "body": "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"
		}`,
    bindings: [
      { name: "序号", bind: "id" },
      { name: "用户", bind: "userId" },
      { name: "名称", bind: "title" },
      { name: "内容", bind: "body" },
    ],
  },
];
