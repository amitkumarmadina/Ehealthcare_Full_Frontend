import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DoctorCard from '../DoctorCard'
import { describe, it, expect } from 'vitest'

describe('DoctorCard Component', () => {
  const mockDoctor = {
    _id: '1',
    name: 'Dr. John Doe',
    specialization: 'Cardiologist',
    experience: 10,
    fees: 500,
  }

  it('renders doctor information correctly', () => {
    render(
      <MemoryRouter>
        <DoctorCard doctor={mockDoctor} />
      </MemoryRouter>
    )

    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument()
    expect(screen.getByText('Cardiologist')).toBeInTheDocument()
    expect(screen.getByText('Experience: 10 years')).toBeInTheDocument()
    expect(screen.getByText('Fees: Rs. 500')).toBeInTheDocument()
  })

  it('contains a link to the doctor profile', () => {
    render(
      <MemoryRouter>
        <DoctorCard doctor={mockDoctor} />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: /view profile/i })
    expect(link).toHaveAttribute('href', '/doctor/1')
  })

  it('renders the initial of the doctor name', () => {
    render(
      <MemoryRouter>
        <DoctorCard doctor={mockDoctor} />
      </MemoryRouter>
    )

    expect(screen.getByText('D')).toBeInTheDocument()
  })
})
