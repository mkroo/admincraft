import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'AdminCraft',
    description: 'AI 시대의 셀프서비스 어드민 프레임워크',
    lang: 'ko-KR',
    base: '/admincraft/',
    ignoreDeadLinks: 'localhostLinks',

    themeConfig: {
      logo: '/logo.svg',

      nav: [
        { text: '가이드', link: '/guide/what-is-admincraft' },
        { text: '설정', link: '/configuration/oauth' },
        { text: '컴포넌트', link: '/components/overview' },
        { text: 'API', link: '/api/storage-adapter' },
        {
          text: '링크',
          items: [
            { text: 'GitHub', link: 'https://github.com/mkroo/admincraft' },
            { text: 'Changelog', link: 'https://github.com/mkroo/admincraft/blob/main/CHANGELOG.md' },
          ],
        },
      ],

      sidebar: {
        '/guide/': [
          {
            text: '소개',
            items: [
              { text: 'AdminCraft란?', link: '/guide/what-is-admincraft' },
              { text: '시작하기', link: '/guide/getting-started' },
              { text: '역할과 권한', link: '/guide/roles-and-permissions' },
            ],
          },
          {
            text: '설치',
            items: [
              { text: 'Docker 설치', link: '/guide/self-hosting-docker' },
              { text: '수동 설치', link: '/guide/self-hosting-manual' },
            ],
          },
          {
            text: '페이지 만들기',
            items: [
              { text: 'AI로 페이지 만들기', link: '/guide/creating-pages-ai' },
              { text: '코드로 페이지 만들기', link: '/guide/creating-pages-code' },
            ],
          },
          {
            text: '활용',
            items: [
              { text: '페이지 갤러리', link: '/guide/page-gallery' },
              { text: '메뉴 관리', link: '/guide/menu-management' },
            ],
          },
        ],

        '/configuration/': [
          {
            text: '설정',
            items: [
              { text: '인증 (OIDC)', link: '/configuration/oauth' },
              { text: 'AI Provider', link: '/configuration/ai-provider' },
              { text: 'Storage Adapter', link: '/configuration/storage-adapter' },
              { text: 'API 환경 (Dev/Prod)', link: '/configuration/api-environments' },
              { text: '디자인 시스템', link: '/configuration/design-system' },
            ],
          },
        ],

        '/components/': [
          {
            text: '컴포넌트',
            items: [
              { text: '개요', link: '/components/overview' },
            ],
          },
        ],

        '/api/': [
          {
            text: 'API 레퍼런스',
            items: [
              { text: 'StorageAdapter', link: '/api/storage-adapter' },
              { text: 'AIAdapter', link: '/api/ai-adapter' },
              { text: 'AuthAdapter', link: '/api/auth-adapter' },
              { text: 'Hooks', link: '/api/hooks' },
            ],
          },
        ],

        '/contributing/': [
          {
            text: '기여 가이드',
            items: [
              { text: '개발 환경 구성', link: '/contributing/development' },
              { text: '아키텍처', link: '/contributing/architecture' },
              { text: '컴포넌트 추가', link: '/contributing/adding-components' },
            ],
          },
        ],
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/mkroo/admincraft' },
      ],

      editLink: {
        pattern: 'https://github.com/mkroo/admincraft/edit/main/docs/:path',
        text: '이 페이지 수정 제안',
      },

      search: {
        provider: 'local',
      },

      footer: {
        message: 'MIT License로 배포됩니다.',
        copyright: 'Copyright © 2025-present AdminCraft Contributors',
      },
    },

    mermaid: {
      theme: 'neutral',
    },
  }),
)
