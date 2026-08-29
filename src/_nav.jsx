/**
 * Sidebar Navigation Configuration
 *
 * Menú simplificado para la práctica "UTEQ Smart Parking": mantiene el
 * Dashboard de la plantilla y agrega una única opción funcional para el
 * caso de estudio, "Vehículos y propietarios".
 *
 * @module _nav
 */

import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCarAlt, cilSpeedometer } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Parqueadero',
  },
  {
    component: CNavItem,
    name: 'Vehículos y propietarios',
    to: '/parqueadero/vehiculos',
    icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
  },
]

export default _nav
