import React from "react";
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Badge,
  Button,
  Stack,
  ThemeIcon,
  List,
  Anchor,
  Box,
  Center,
} from "@mantine/core";
import {
  IconPalette,
  IconLayout,
  IconCode,
  IconBrandReact,
  IconBrandTypescript,
  IconBrandVite,
  IconBrandMantine,
  IconBrandGithub,
  IconExternalLink,
  IconCheck,
} from "@tabler/icons-react";

const AboutPage: React.FC = () => {
  return (
    <Container size="xl" py="xl">
      {/* 页面标题 */}
      <Center mb="xl">
        <Stack align="center" gap="md">
          <Title order={1} size="3rem" ta="center" c="blue">
            MixBoxLayout PDF React 应用
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            基于 React 19 + Mantine + TypeScript 的现代化PDF布局设计工具
          </Text>
        </Stack>
      </Center>

      {/* 主要特性 */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group mb="md">
              <ThemeIcon size="lg" variant="light" color="blue">
                <IconPalette size="1.5rem" />
              </ThemeIcon>
              <Title order={3}>可视化设计</Title>
            </Group>
            <Text size="sm" c="dimmed">
              通过直观的拖拽操作，快速创建复杂的页面布局。支持多种组件类型，满足不同设计需求。
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group mb="md">
              <ThemeIcon size="lg" variant="light" color="green">
                <IconLayout size="1.5rem" />
              </ThemeIcon>
              <Title order={3}>响应式布局</Title>
            </Group>
            <Text size="sm" c="dimmed">
              自动适配不同屏幕尺寸，确保在各种设备上都能完美显示。支持移动端和桌面端优化。
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group mb="md">
              <ThemeIcon size="lg" variant="light" color="orange">
                <IconCode size="1.5rem" />
              </ThemeIcon>
              <Title order={3}>插件系统</Title>
            </Group>
            <Text size="sm" c="dimmed">
              强大的插件系统，支持自定义组件和功能扩展。轻松集成第三方组件库。
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* 技术栈 */}
      <Card shadow="sm" padding="xl" radius="md" withBorder mb="xl">
        <Title order={2} mb="md" ta="center">
          技术栈
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              <Group>
                <ThemeIcon size="lg" variant="light" color="cyan">
                  <IconBrandReact size="1.5rem" />
                </ThemeIcon>
                <div>
                  <Text fw={600}>React 19</Text>
                  <Text size="sm" c="dimmed">
                    最新的 React 框架，提供更好的性能和开发体验
                  </Text>
                </div>
              </Group>
              <Group>
                <ThemeIcon size="lg" variant="light" color="blue">
                  <IconBrandTypescript size="1.5rem" />
                </ThemeIcon>
                <div>
                  <Text fw={600}>TypeScript</Text>
                  <Text size="sm" c="dimmed">
                    类型安全的 JavaScript，提供更好的开发体验
                  </Text>
                </div>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              <Group>
                <ThemeIcon size="lg" variant="light" color="yellow">
                  <IconBrandVite size="1.5rem" />
                </ThemeIcon>
                <div>
                  <Text fw={600}>Vite</Text>
                  <Text size="sm" c="dimmed">
                    快速的前端构建工具，提供极速的开发体验
                  </Text>
                </div>
              </Group>
              <Group>
                <ThemeIcon size="lg" variant="light" color="indigo">
                  <IconBrandMantine size="1.5rem" />
                </ThemeIcon>
                <div>
                  <Text fw={600}>Mantine</Text>
                  <Text size="sm" c="dimmed">
                    功能丰富的 React 组件库，提供现代化的 UI 组件
                  </Text>
                </div>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* 主要功能 */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Title order={3} mb="md">
              核心功能
            </Title>
            <List
              spacing="sm"
              size="sm"
              center
              icon={<IconCheck size="1rem" />}
            >
              <List.Item>可视化拖拽设计</List.Item>
              <List.Item>丰富的组件库</List.Item>
              <List.Item>实时预览功能</List.Item>
              <List.Item>响应式布局</List.Item>
              <List.Item>主题切换</List.Item>
              <List.Item>撤销/重做操作</List.Item>
            </List>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Title order={3} mb="md">
              高级特性
            </Title>
            <List
              spacing="sm"
              size="sm"
              center
              icon={<IconCheck size="1rem" />}
            >
              <List.Item>多页面管理</List.Item>
              <List.Item>PDF 导出</List.Item>
              <List.Item>插件系统</List.Item>
              <List.Item>国际化支持</List.Item>
              <List.Item>数据绑定</List.Item>
              <List.Item>自定义主题</List.Item>
            </List>
          </Card>
        </Grid.Col>
      </Grid>

      {/* 项目信息 */}
      <Card shadow="sm" padding="xl" radius="md" withBorder mb="xl">
        <Title order={2} mb="md" ta="center">
          项目信息
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack align="center" gap="sm">
              <Badge size="lg" variant="light" color="blue">
                React 19
              </Badge>
              <Text size="sm" c="dimmed" ta="center">
                基于最新的 React 19 框架构建
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack align="center" gap="sm">
              <Badge size="lg" variant="light" color="green">
                TypeScript
              </Badge>
              <Text size="sm" c="dimmed" ta="center">
                TypeScript 开发，类型安全
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack align="center" gap="sm">
              <Badge size="lg" variant="light" color="orange">
                Mantine
              </Badge>
              <Text size="sm" c="dimmed" ta="center">
                使用 Mantine 组件库
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* 操作按钮 */}
      <Center>
        <Group gap="md">
          <Button
            size="lg"
            leftSection={<IconBrandGithub size="1.2rem" />}
            variant="light"
            component="a"
            href="https://github.com/your-username/mbl"
            target="_blank"
            rel="noopener noreferrer"
          >
            查看源码
          </Button>
          <Button
            size="lg"
            leftSection={<IconExternalLink size="1.2rem" />}
            component="a"
            href="/"
          >
            开始设计
          </Button>
        </Group>
      </Center>

      {/* 页脚信息 */}
      <Box
        mt="xl"
        pt="xl"
        style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
      >
        <Text size="sm" c="dimmed" ta="center">
          © 2024 MixBoxLayout React 应用. 基于 React 19 + Mantine + TypeScript
          构建.
        </Text>
      </Box>
    </Container>
  );
};

export default AboutPage;
