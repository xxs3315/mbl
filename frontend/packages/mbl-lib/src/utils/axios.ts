import axios from "axios";

/**
 * axios配置文件
 *
 * 使用方式：
 *
 * 1. 在 MixBoxLayout 组件中使用：
 *    import { configureAxios } from './utils/axios';
 *
 *    React.useEffect(() => {
 *      if (baseUrl) {
 *        // 配置axios的baseURL
 *        configureAxios(baseUrl);
 *      }
 *    }, [baseUrl]);
 *
 * 2. 在其他地方使用：
 *    import { configureAxios } from './utils/axios';
 *
 *    // 配置自定义baseURL
 *    configureAxios('https://api.example.com');
 *
 *    // 或者重置为默认（空字符串）
 *    configureAxios();
 *
 * 3. 参数说明：
 *    - baseUrl?: string - 可选的baseURL，如果不传则使用空字符串
 *
 * 4. 注意事项：
 *    - 每次调用configureAxios都会清除之前的拦截器并重新配置
 *    - 建议在应用启动时或组件挂载时调用一次
 *    - 如果baseUrl为空，axios请求将使用相对路径
 */

// 创建一个axios实例配置函数
export function configureAxios(baseUrl?: string) {
  // 设置baseURL，如果没有传入则使用空字符串
  const baseURL = baseUrl || "";

  // 清除之前的拦截器（避免重复添加）
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();

  // 响应拦截器
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error("Axios response error:", error);
      return Promise.reject(error);
    },
  );

  // 请求拦截器
  axios.interceptors.request.use(
    (config) => {
      console.log("Request config:", config);
      // config.headers["Accept"] = "*/*";
      // config.headers["Content-Type"] = "application/json";
      config.baseURL = baseURL;
      config.timeout = 100000;
      // 添加CORS相关配置
      config.withCredentials = false;
      return config;
    },
    (error) => {
      console.error("Axios request error:", error);
      return Promise.reject(error);
    },
  );
}

// 默认配置（向后兼容）
configureAxios();

/**
 * GET请求函数
 *
 * 使用方式：
 * import { getAxios } from './utils/axios';
 *
 * // 基本GET请求
 * getAxios({
 *   url: '/api/users',
 *   params: { page: 1, limit: 10 }
 * }).then(data => {
 *   console.log('用户数据:', data);
 * }).catch(err => {
 *   console.error('请求失败:', err);
 * });
 *
 * 参数说明：
 * - url: string - 请求的URL路径
 * - params?: object - 可选的查询参数
 */
export function getAxios({ url, params = {} }: any) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
      })
      .then((res) => {
        console.log(res);
        resolve(res.data);
      })
      .catch((err) => {
        console.error("Axios get error:", err);
        reject(err);
      });
  });
}

/**
 * POST请求函数
 *
 * 使用方式：
 * import { postAxios } from './utils/axios';
 *
 * // 基本POST请求
 * postAxios({
 *   url: '/api/users',
 *   data: { name: '张三', email: 'zhangsan@example.com' }
 * }).then(data => {
 *   console.log('创建成功:', data);
 * }).catch(err => {
 *   console.error('创建失败:', err);
 * });
 *
 * 参数说明：
 * - url: string - 请求的URL路径
 * - data: any - 要发送的数据
 */
export function postAxios({ url, data }: any) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    })
      .then((res) => {
        console.log("Post response:", res);
        resolve(res.data);
      })
      .catch((err) => {
        console.error("Post error:", err);
        reject(err);
      });
  });
}

/**
 * 文件下载函数
 *
 * 使用方式：
 * import { downloadAxios } from './utils/axios';
 *
 * // 下载PDF文件
 * downloadAxios({
 *   url: '/api/download/report',
 *   filename: '月度报告'
 * }).then(() => {
 *   console.log('下载完成');
 * }).catch(err => {
 *   console.error('下载失败:', err);
 * });
 *
 * 参数说明：
 * - url: string - 下载文件的URL路径
 * - filename: string - 下载文件的名称（不包含扩展名）
 *
 * 注意事项：
 * - 当前只支持PDF文件下载
 * - 会自动添加.pdf扩展名
 */
export function downloadAxios({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: "get",
      responseType: "blob",
    })
      .then((res) => {
        // 创建 blob URL
        const blob = new Blob([res.data], { type: "application/pdf" });
        const blobUrl = window.URL.createObjectURL(blob);

        // 创建下载链接
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${filename}.pdf`;
        link.style.display = "none";

        // 添加到 DOM 并触发下载
        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        resolve(res);
      })
      .catch((err) => {
        console.error("Download error:", err);
        reject(err);
      });
  });
}

export default axios;
