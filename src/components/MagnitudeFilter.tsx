import { Button, Card, Form } from 'react-bootstrap'
import type { MagnitudeRange } from '../types'

interface Props {
  min: number                                
  max: number                                
  value: MagnitudeRange                     
  onChange: (value: MagnitudeRange) => void  
  onSearch: () => void                       
}
export default function MagnitudeFilter({ min, max, value, onChange, onSearch }: Props) {
  const setFrom = (from: number) => onChange({ from: Math.min(from, value.to), to: value.to })
  const setTo = (to: number) => onChange({ from: value.from, to: Math.max(to, value.from) })

  return (
    <Card className="filter mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <span className="filter-label">Видимая звёздная величина, m</span>
          <span className="filter-value">{value.from.toFixed(1)} – {value.to.toFixed(1)}</span>
        </div>
        <Form.Label className="range-row">от
          <Form.Range min={min} max={max} step={0.1} value={value.from}
            onChange={e => setFrom(Number(e.target.value))} />
        </Form.Label>
        <Form.Label className="range-row">до
          <Form.Range min={min} max={max} step={0.1} value={value.to}
            onChange={e => setTo(Number(e.target.value))} />
        </Form.Label>
        <Button className="btn-gold w-100 mt-2" onClick={onSearch}>Найти</Button>
      </Card.Body>
    </Card>
  )
}
