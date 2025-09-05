import { FC, memo } from "react";
import { useCurrentSelectedId } from "../../providers/current-selected-id-provider";
import { useSelectedItem } from "../../hooks/use-selected-item";
import {
  Divider,
  Title,
  Group,
  Image as MantineImage,
  Button,
  FileButton,
  NumberInput,
  Checkbox,
  Grid,
  Stack,
  Text,
  SegmentedControl,
  VisuallyHidden,
} from "@mantine/core";
import React from "react";
import { useContentsStoreContext } from "../../store/store";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import axios, { configureAxios } from "../../utils/axios";
import {
  updateSelectedItemProp,
  updateSelectedItemProps,
} from "../../utils/content-updaters";
import { DebouncedTextarea } from "../../utils/debounced-textarea";

// 图片上传配置接口
interface ImageUploadConfig {
  baseUrl?: string;
  imageUploadPath?: string;
}

// 图片数据接口
/**
 * {
 *   "filename": "img_1756823523635_AAvX0k4w.png",
 *   "originalName": "aaa.png",
 *   "size": 62987,
 *   "width": 1063,
 *   "height": 563,
 *   "url": "/api/pdf/images/img_1756823523635_AAvX0k4w.png",
 *   "message": "图片上传成功"
 * }
 */
interface ImageData {
  filename: string;
  url: string;
  width: number;
  height: number;
}

export const AttrImage: FC<ImageUploadConfig> = memo(function AttrImage({
  baseUrl,
  imageUploadPath,
}) {
  const { currentSelectedId, setCurrentSelectedId } = useCurrentSelectedId();
  const { item: currentSelectedItem, position: currentSelectedItemPosition } =
    useSelectedItem();

  const state = useContentsStoreContext((s) => s);
  const currentPageIndex = state.currentPageIndex;
  const setCurrentPageAndContent = state.setCurrentPageAndContent;

  // 如果当前选中的元素在当前页面中不存在，清除选中状态
  React.useEffect(() => {
    if (currentSelectedId && !currentSelectedItem) {
      setCurrentSelectedId("");
    }
  }, [currentSelectedId, currentSelectedItem, setCurrentSelectedId]);

  // 配置axios baseURL
  React.useEffect(() => {
    if (baseUrl) {
      configureAxios(baseUrl);
    }
  }, [baseUrl]);

  // 检查文件大小限制 (100KB)
  const checkFileSize = (file: File) => {
    const maxSize = 100 * 1024; // 100KB in bytes
    if (file.size > maxSize) {
      alert(
        `文件大小超出限制：${(file.size / 1024).toFixed(2)}KB，最大允许：${(maxSize / 1024).toFixed(2)}KB`,
      );
      return false;
    }
    return true;
  };

  // 将文件转换为base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // 从base64获取图片尺寸
  const getImageDimensions = (
    base64: string,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = base64;
    });
  };

  // 上传文件到服务器
  const uploadImageToServer = async (file: File): Promise<ImageData> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        imageUploadPath || "/api/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data as ImageData;
    } catch (error) {
      console.error("上传失败:", error);
      throw new Error("图片上传失败，请重试");
    }
  };

  // 更新图片信息
  const updateImageInfo = (
    imageData: ImageData | { base64: string; width: number; height: number },
  ) => {
    if (currentSelectedItem && currentSelectedItemPosition) {
      // 先计算新的height值
      let newHeight: number | undefined;
      if (imageData.height && imageData.width && currentSelectedItem.width) {
        newHeight = Math.round(
          imageData.height * (currentSelectedItem.width / imageData.width),
        );
      }
      if ("base64" in imageData) {
        // 浏览器base64模式 - 同时更新所有属性
        updateSelectedItemProps(
          {
            currentSelectedId: currentSelectedId!,
            currentPageIndex,
            position: currentSelectedItemPosition,
            state,
            setCurrentPageAndContent,
          },
          {
            origWidth: imageData.width,
            origHeight: imageData.height,
            value: imageData.base64,
            height: newHeight,
          },
        );
      } else {
        // 服务器上传模式 - 同时更新所有属性
        updateSelectedItemProps(
          {
            currentSelectedId: currentSelectedId!,
            currentPageIndex,
            position: currentSelectedItemPosition,
            state,
            setCurrentPageAndContent,
          },
          {
            origWidth: imageData.width,
            origHeight: imageData.height,
            value: baseUrl ? `${baseUrl}${imageData.url}` : imageData.url,
            height: newHeight,
          },
        );
      }
    }
  };

  // 处理文件上传
  const handleFileUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    // 检查文件大小
    if (!checkFileSize(file)) {
      return;
    }

    try {
      if (imageUploadPath && baseUrl) {
        // 服务器上传模式
        const imageData = await uploadImageToServer(file);
        updateImageInfo(imageData);
      } else {
        // 浏览器base64模式
        const base64 = await fileToBase64(file);
        const dimensions = await getImageDimensions(base64);
        updateImageInfo({
          base64,
          width: dimensions.width,
          height: dimensions.height,
        });
      }
    } catch (error) {
      console.error("图片处理失败:", error);
      alert(error instanceof Error ? error.message : "图片处理失败");
    }
  };

  // 更新图片属性
  const updateImageProperty = (property: string, value: any) => {
    if (currentSelectedItem && currentSelectedItemPosition) {
      if (property === "width" || property === "height") {
        // 对于width和height，需要同时计算两个值并一起更新
        let newWidth = currentSelectedItem.width;
        let newHeight = currentSelectedItem.height;

        if (property === "width") {
          newWidth = value;
          // 根据原始尺寸比例计算新的height
          if (currentSelectedItem.origHeight && currentSelectedItem.origWidth) {
            newHeight = Math.round(
              currentSelectedItem.origHeight *
                (value / currentSelectedItem.origWidth),
            );
          }
        } else if (property === "height") {
          newHeight = value;
          // 根据原始尺寸比例计算新的width
          if (currentSelectedItem.origHeight && currentSelectedItem.origWidth) {
            newWidth = Math.round(
              currentSelectedItem.origWidth *
                (value / currentSelectedItem.origHeight),
            );
          }
        }

        // 同时更新width和height
        updateSelectedItemProps(
          {
            currentSelectedId: currentSelectedId!,
            currentPageIndex,
            position: currentSelectedItemPosition,
            state,
            setCurrentPageAndContent,
          },
          {
            width: newWidth,
            height: newHeight,
          },
        );
      } else {
        // 对于其他属性，使用单属性更新
        updateSelectedItemProp(
          {
            currentSelectedId: currentSelectedId!,
            currentPageIndex,
            position: currentSelectedItemPosition,
            state,
            setCurrentPageAndContent,
          },
          property,
          value,
        );
      }
    }
  };

  if (!currentSelectedItem) {
    return null;
  }

  return (
    <>
      <Title order={4}>图片属性</Title>
      <Divider my="xs" />

      <Group justify="center">
        {currentSelectedItem?.value ? (
          <MantineImage
            radius="xs"
            src={currentSelectedItem.value}
            w={160}
            h={"auto"}
          />
        ) : (
          <div
            style={{
              width: "160px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8f9fa",
              border: "1px dashed #dee2e6",
              borderRadius: "4px",
              color: "#6c757d",
              fontSize: "12px",
            }}
          >
            图片预览
          </div>
        )}
      </Group>

      <Group justify="center" mt="xs">
        <FileButton
          onChange={handleFileUpload}
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        >
          {(props) => (
            <Button size="compact-xs" {...props}>
              上传图片
            </Button>
          )}
        </FileButton>
      </Group>

      <Grid mt="xs">
        <Grid.Col span={6}>
          <Stack align="center" gap={0}>
            <Text size="xs" fw={200} mb={2} mt={4}>
              原始宽度
            </Text>
            <Text size="xs" fw={300} mb={2} mt={4}>
              {currentSelectedItem?.origWidth || "n/a"}
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack align="center" gap={0}>
            <Text size="xs" fw={200} mb={2} mt={4}>
              原始高度
            </Text>
            <Text size="xs" fw={300} mb={2} mt={4}>
              {currentSelectedItem?.origHeight || "n/a"}
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>

      <Grid gutter="xs" mt="xs">
        <Grid.Col span={12}>
          <Checkbox
            size="xs"
            fw={500}
            label="超链接"
            checked={currentSelectedItem?.isHyperlink ?? false}
            onChange={(event) => {
              updateImageProperty("isHyperlink", event.currentTarget.checked);
            }}
          />
        </Grid.Col>
      </Grid>

      {currentSelectedItem?.isHyperlink && (
        <Grid gutter="xs" mt="xs">
          <Grid.Col span={12}>
            <DebouncedTextarea
              size="xs"
              radius="xs"
              label="超链接地址"
              placeholder="请输入超链接地址"
              autosize
              minRows={2}
              maxRows={20}
              resize="vertical"
              value={currentSelectedItem?.hyperlinkUri ?? ""}
              onChange={(value) => {
                updateImageProperty("hyperlinkUri", value);
              }}
              debounceMs={300}
            />
          </Grid.Col>
        </Grid>
      )}

      <NumberInput
        label="图片宽度"
        size="xs"
        value={currentSelectedItem?.width}
        onChange={(value) => updateImageProperty("width", Number(value))}
        min={6}
        mt="xs"
      />

      <NumberInput
        label="图片高度"
        size="xs"
        value={currentSelectedItem?.height}
        onChange={(value) => updateImageProperty("height", Number(value))}
        min={6}
        mt="xs"
      />

      <Grid gutter="xs" mt="xs">
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="左内边距"
            size="xs"
            value={currentSelectedItem?.pLeft ?? 0}
            onChange={(value) =>
              updateImageProperty("pLeft", value ? Number(value) : 0)
            }
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="右内边距"
            size="xs"
            value={currentSelectedItem?.pRight ?? 0}
            onChange={(value) =>
              updateImageProperty("pRight", value ? Number(value) : 0)
            }
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="上内边距"
            size="xs"
            value={currentSelectedItem?.pTop ?? 0}
            onChange={(value) =>
              updateImageProperty("pTop", value ? Number(value) : 0)
            }
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            min={0}
            label="下内边距"
            size="xs"
            value={currentSelectedItem?.pBottom ?? 0}
            onChange={(value) =>
              updateImageProperty("pBottom", value ? Number(value) : 0)
            }
          />
        </Grid.Col>
      </Grid>

      <div>
        <Text size="xs" fw={500} mb={2} mt="xs">
          水平对齐
        </Text>
        <Stack align="center">
          <SegmentedControl
            value={currentSelectedItem?.horizontal || "center"}
            onChange={(value) => updateImageProperty("horizontal", value)}
            data={[
              {
                value: "left",
                label: (
                  <>
                    <AlignLeft
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <VisuallyHidden>左对齐</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "center",
                label: (
                  <>
                    <AlignCenter
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <VisuallyHidden>居中</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "right",
                label: (
                  <>
                    <AlignRight
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <VisuallyHidden>右对齐</VisuallyHidden>
                  </>
                ),
              },
            ]}
          />
        </Stack>
      </div>
    </>
  );
});
