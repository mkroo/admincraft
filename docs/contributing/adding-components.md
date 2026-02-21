# 컴포넌트 추가

프리셋 카탈로그에 새로운 컴포넌트를 추가하는 방법을 안내합니다.

## 컴포넌트 설계 원칙

1. **어드민 페이지에 자주 쓰이는 패턴**인지 확인
2. **Props는 단순하게** - 비개발자가 AI를 통해 사용하므로 복잡한 props 지양
3. **래퍼 구조 유지** - 내부 구현(shadcn/ui)을 직접 노출하지 않음
4. **디자인 토큰 사용** - 색상, 간격 등은 CSS 변수 사용

## 추가 절차

### 1. Props 인터페이스 정의

먼저 컴포넌트의 public API를 설계합니다.

```typescript
// packages/ui/src/data-display/Timeline.tsx

interface TimelineProps {
  items: TimelineItem[]
}

interface TimelineItem {
  title: string
  description?: string
  timestamp: string
  status?: 'success' | 'warning' | 'error' | 'default'
}
```

### 2. 래퍼 컴포넌트 구현

shadcn/ui 또는 Radix UI를 내부적으로 사용하되, Props 인터페이스를 통해 추상화합니다.

```tsx
// packages/ui/src/data-display/Timeline.tsx
import * as React from 'react'

export interface TimelineProps {
  items: TimelineItem[]
}

export interface TimelineItem {
  title: string
  description?: string
  timestamp: string
  status?: 'success' | 'warning' | 'error' | 'default'
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(item.status)}`} />
          <div>
            <div className="font-medium">{item.title}</div>
            {item.description && (
              <div className="text-sm text-muted-foreground">{item.description}</div>
            )}
            <div className="text-xs text-muted-foreground">{item.timestamp}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getStatusColor(status?: string) {
  switch (status) {
    case 'success': return 'bg-[hsl(var(--admin-success))]'
    case 'warning': return 'bg-yellow-500'
    case 'error': return 'bg-[hsl(var(--admin-danger))]'
    default: return 'bg-[hsl(var(--admin-primary))]'
  }
}
```

### 3. index에서 export

```typescript
// packages/ui/src/index.ts
export { Timeline } from './data-display/Timeline'
export type { TimelineProps, TimelineItem } from './data-display/Timeline'
```

### 4. AI 하네스 업데이트

`@admincraft/ai`의 컴포넌트 카탈로그에 새 컴포넌트를 추가합니다.

```
// packages/ai/src/harness/component-catalog.ts

<Timeline items={TimelineItem[]} />

TimelineItem: { title: string, description?: string, timestamp: string, status?: 'success'|'warning'|'error'|'default' }
```

이렇게 해야 AI가 새 컴포넌트를 인식하고 페이지 생성 시 사용할 수 있습니다.

### 5. 문서 추가

`docs/components/` 디렉토리에 컴포넌트 문서를 추가합니다.

```markdown
<!-- docs/components/timeline.md -->
# Timeline

이벤트를 시간순으로 표시하는 컴포넌트입니다.

## Props
...

## 예제
...
```

`docs/.vitepress/config.ts`의 사이드바에도 추가합니다.

### 6. 테스트 작성

```typescript
// packages/ui/src/data-display/__tests__/Timeline.test.tsx
import { render, screen } from '@testing-library/react'
import { Timeline } from '../Timeline'

describe('Timeline', () => {
  it('renders items', () => {
    render(
      <Timeline items={[
        { title: '주문 생성', timestamp: '2025-01-01 10:00' },
        { title: '결제 완료', timestamp: '2025-01-01 10:05' },
      ]} />
    )
    expect(screen.getByText('주문 생성')).toBeInTheDocument()
    expect(screen.getByText('결제 완료')).toBeInTheDocument()
  })
})
```

### 7. Changeset 추가

```bash
pnpm changeset
# @admincraft/preset-antd → minor
# "Timeline 컴포넌트를 카탈로그에 추가"
```

## 체크리스트

- [ ] Props 인터페이스가 단순하고 명확한가
- [ ] 내부 구현(shadcn/ui)이 외부에 노출되지 않는가
- [ ] 디자인 토큰(CSS 변수)을 사용하는가
- [ ] AI 하네스 컴포넌트 카탈로그를 업데이트했는가
- [ ] 문서를 추가했는가
- [ ] 테스트를 작성했는가
- [ ] Changeset을 추가했는가
