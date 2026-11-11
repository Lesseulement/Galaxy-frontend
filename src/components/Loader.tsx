import { Spinner } from 'react-bootstrap'

// Анимация загрузки поверх страницы: пока идёт запрос, кнопки нажать нельзя
export default function Loader({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="loader">
      <Spinner animation="border" className="loader-spinner" />
    </div>
  )
}
