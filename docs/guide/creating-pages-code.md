# 코드로 페이지 만들기

TSX를 직접 작성하여 페이지를 만듭니다. 고도로 커스터마이징된 페이지가 필요한 개발자를 위한 방법입니다.

## 페이지 생성

1. **새 페이지 만들기** 클릭
2. **코드로 작성하기** 선택
3. Monaco Editor(VS Code 동일 엔진)가 열립니다

## 에디터 기능

- **자동완성**: 설정된 UI 라이브러리의 컴포넌트 props 자동완성
- **실시간 미리보기**: 타이핑하면 우측에 즉시 반영 (Sucrase 브라우저 컴파일)
- **에러 표시**: import 위반, 보안 패턴 위반 시 빨간 밑줄 표시
- **환경 전환**: 상단 드롭다운으로 API 환경(dev/staging/prod) 전환 ([API 환경 설정](/configuration/api-environments) 참고)

화면은 좌우 2분할로 구성됩니다:

| 좌측: 코드 에디터 (Monaco) | 우측: 실시간 미리보기 |
|:---|:---|
| TSX 코드를 직접 작성 | 타이핑할 때마다 Sucrase로 즉시 컴파일 |
| 컴포넌트 props 자동완성 | iframe 샌드박스에서 실제 렌더링 |
| import 위반/보안 패턴 위반 시 에러 표시 | 마지막 성공 상태를 유지 |

## 기본 페이지 구조

설정된 프리셋의 UI 라이브러리를 직접 import하여 사용합니다. 아래 예시는 Ant Design 프리셋 기준입니다.

```tsx
import { Card } from 'antd'
import { useApi } from '@admincraft/hooks'

export default function MyPage() {
  const api = useApi()

  return (
    <Card title="내 페이지">
      {/* 여기에 UI 구성 */}
    </Card>
  )
}
```

## 예제: 목록 페이지

```tsx
import { useState, useEffect } from 'react'
import { Table, Card, Space, Input, DatePicker, Button, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useApi } from '@admincraft/hooks'

export default function OrderList() {
  const api = useApi()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async (params?: Record<string, any>) => {
    setLoading(true)
    try {
      const res = await api.get('/orders', { params })
      setData(res.data.items)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const columns = [
    { title: '주문번호', dataIndex: 'id', key: 'id' },
    { title: '주문자', dataIndex: 'customerName', key: 'customerName' },
    { title: '금액', dataIndex: 'amount', key: 'amount',
      render: (v: number) => `₩${v.toLocaleString()}` },
    { title: '상태', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={s === 'completed' ? 'green' : 'blue'}>{s}</Tag> },
  ]

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space>
          <Input placeholder="주문번호/주문자" prefix={<SearchOutlined />} />
          <DatePicker.RangePicker />
          <Button type="primary" onClick={() => fetchData()}>검색</Button>
        </Space>
      </Card>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
    </Space>
  )
}
```

## 예제: 상세 페이지

```tsx
import { useState, useEffect } from 'react'
import { Descriptions, Card, Space, Button } from 'antd'
import { useApi, usePageParams } from '@admincraft/hooks'

export default function OrderDetail() {
  const api = useApi()
  const { id } = usePageParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => setOrder(res.data))
  }, [id])

  if (!order) return null

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="주문 상세" extra={<Button type="primary">수정</Button>}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="주문번호">{order.id}</Descriptions.Item>
          <Descriptions.Item label="주문자">{order.customerName}</Descriptions.Item>
          <Descriptions.Item label="주문일시">{order.createdAt}</Descriptions.Item>
          <Descriptions.Item label="결제 금액">₩{order.amount.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="결제 수단">{order.paymentMethod}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  )
}
```

## 예제: 수정 폼 페이지

```tsx
import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useApi, usePageParams } from '@admincraft/hooks'

export default function OrderEdit() {
  const api = useApi()
  const { id } = usePageParams()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => form.setFieldsValue(res.data))
  }, [id])

  const handleSubmit = async (values: Record<string, any>) => {
    setLoading(true)
    try {
      await api.put(`/orders/${id}`, values)
      message.success('저장되었습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="주문 수정">
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: 600 }}>
        <Form.Item name="address" label="배송지 주소" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="연락처" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="memo" label="배송 메모">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>저장</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
```

## 사용 가능한 모듈

Import Map 화이트리스트에 의해 다음 모듈만 사용할 수 있습니다:

| 모듈 | 용도 |
|------|------|
| `react` | React 기본 (useState, useEffect 등) |
| `react-dom/client` | React DOM 렌더링 |
| `@admincraft/hooks` | 유틸리티 훅 (useApi, usePageParams 등) |
| 프리셋 모듈 | 설정된 프리셋의 라이브러리 (예: `antd`, `@ant-design/icons`, `dayjs`) |

이 목록에 없는 모듈을 import하면 저장 시 거부됩니다. 프리셋별 사용 가능한 모듈은 [디자인 시스템 설정](/configuration/design-system)을 참고하세요.

## API 호출

페이지에서 API를 호출할 때는 반드시 `useApi` 훅을 사용합니다.

```tsx
const api = useApi()

// GET
const res = await api.get('/orders', { params: { page: 1 } })

// POST
await api.post('/orders', { customerName: '홍길동', amount: 50000 })

// PUT
await api.put('/orders/123', { status: 'completed' })

// DELETE
await api.delete('/orders/123')
```

`useApi`는 내부적으로 postMessage 브릿지를 통해 부모 프레임에 요청을 전달합니다. 부모 프레임이 access token을 주입하고, OAS3 allowlist를 확인한 후 외부 API 서버로 프록시합니다.

::: warning 직접 fetch 사용 불가
`fetch()`, `XMLHttpRequest`, `WebSocket`은 CSP에 의해 차단됩니다. 반드시 `useApi` 훅을 통해 API를 호출하세요.
:::

## 커스텀 컴포넌트

프리셋 라이브러리에서 제공하지 않는 UI가 필요한 경우, 페이지 내에서 직접 커스텀 컴포넌트를 만들 수 있습니다.

```tsx
// 커스텀 타임라인 컴포넌트 예시
function Timeline({ items }: { items: { title: string; timestamp: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: 12,
          padding: 12,
          borderLeft: '2px solid var(--ant-primary-color)',
        }}>
          <div>
            <div style={{ fontWeight: 600 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{item.timestamp}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

::: tip 디자인 토큰 활용
프리셋의 디자인 토큰(CSS 변수)을 사용하면 프리셋이 교체되어도 커스텀 컴포넌트의 색상이 자동으로 맞춰집니다. 전체 토큰 목록은 [디자인 시스템 설정](/configuration/design-system)을 참고하세요.
:::

## 저장과 컴파일

**저장** 버튼을 클릭하면:

1. **정적 코드 검증** - 위험 패턴 검사
2. **import 검증** - 프리셋에 등록되지 않은 모듈 검사
3. **SWC 컴파일** - TSX를 최적화된 JavaScript로 변환
4. **DB 저장** - 원본 TSX와 컴파일된 JS 모두 저장

검증에 실패하면 에러 메시지와 함께 저장이 거부됩니다. 에디터에서 위반 항목을 수정한 후 다시 저장하세요.
