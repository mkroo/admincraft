# 컴포넌트 개요

AdminCraft는 **프리셋 기반**으로 UI 라이브러리를 설정합니다. 별도 래퍼 없이, 설정된 디자인 라이브러리의 컴포넌트를 페이지에서 직접 사용합니다.

## 프리셋별 주요 컴포넌트

### shadcn/ui (기본값)

| 용도 | 컴포넌트 | import |
|------|----------|--------|
| 데이터 테이블 | `Table` 조합형 | `import { Table, TableHeader, TableBody, ... } from '@shadcn/ui'` |
| 입력 | `Input`, `Select` 조합형 | `import { Input, Select, SelectTrigger, ... } from '@shadcn/ui'` |
| 카드 | `Card` 조합형 | `import { Card, CardHeader, CardContent } from '@shadcn/ui'` |
| 모달 | `Dialog` 조합형 | `import { Dialog, DialogContent, ... } from '@shadcn/ui'` |
| 상태 표시 | `Badge` | `import { Badge } from '@shadcn/ui'` |
| 탭 | `Tabs` 조합형 | `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@shadcn/ui'` |

### Ant Design

| 용도 | 컴포넌트 | import |
|------|----------|--------|
| 데이터 테이블 | `Table` | `import { Table } from 'antd'` |
| 검색/입력 폼 | `Form`, `Input`, `Select`, `DatePicker` | `import { Form, Input, Select, DatePicker } from 'antd'` |
| 상세 정보 | `Descriptions` | `import { Descriptions } from 'antd'` |
| 통계 카드 | `Card` + `Statistic` | `import { Card, Statistic } from 'antd'` |
| 모달 | `Modal` | `import { Modal } from 'antd'` |
| 상태 표시 | `Tag`, `Badge` | `import { Tag, Badge } from 'antd'` |
| 레이아웃 | `Space`, `Flex`, `Divider` | `import { Space, Flex, Divider } from 'antd'` |
| 알림 | `message`, `notification` | `import { message, notification } from 'antd'` |

### MUI

| 용도 | 컴포넌트 | import |
|------|----------|--------|
| 데이터 테이블 | `DataGrid` | `import { DataGrid } from '@mui/x-data-grid'` |
| 입력 | `TextField`, `Select`, `Autocomplete` | `import { TextField, Select } from '@mui/material'` |
| 카드 | `Card` + `Typography` | `import { Card, CardContent, Typography } from '@mui/material'` |
| 모달 | `Dialog` | `import { Dialog, DialogTitle, ... } from '@mui/material'` |
| 상태 표시 | `Chip` | `import { Chip } from '@mui/material'` |
| 알림 | `Alert`, `Snackbar` | `import { Alert, Snackbar } from '@mui/material'` |

## 사용법

페이지에서 프리셋에 설정된 라이브러리를 직접 import합니다.

```tsx
// Ant Design 프리셋 사용 시
import { useState, useEffect } from 'react'
import { Table, Card, Space, Input, Button, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useApi } from '@admincraft/hooks'

export default function OrderList() {
  const api = useApi()
  const [data, setData] = useState([])

  // ...

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space>
          <Input placeholder="검색" prefix={<SearchOutlined />} />
          <Button type="primary">검색</Button>
        </Space>
      </Card>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </Space>
  )
}
```

## 커스텀 컴포넌트

프리셋 라이브러리에서 제공하지 않는 UI가 필요한 경우, 페이지 내에서 직접 커스텀 컴포넌트를 만들 수 있습니다.

- **AI 자동 생성**: AI가 카탈로그 컴포넌트로 구현 불가능하다고 판단하면, 디자인 토큰을 사용하여 커스텀 컴포넌트를 자동 생성합니다
- **코드 직접 작성**: 개발자가 TSX 에디터에서 직접 작성할 수도 있습니다

자세한 내용은 [AI 페이지 생성 - 커스텀 컴포넌트 폴백](/guide/creating-pages-ai#커스텀-컴포넌트-폴백)을 참고하세요.

## 프리셋 변경

프리셋을 변경하는 방법은 [디자인 시스템 설정](/configuration/design-system)을 참고하세요.
