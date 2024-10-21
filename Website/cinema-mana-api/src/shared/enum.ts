enum SeatStatus {
  MAINTAINED = 'MAINTAINED',
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  RESERVED = 'RESERVED',
}

enum EmployeeRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
}
enum EmployeeGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

enum SeatType {
  VIP = 'VIP',
  ECONOMY = 'ECONOMY',
}

enum ShowtimeStatus {
  NEW = 'NEW',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED',
}

export { SeatStatus, EmployeeGender, EmployeeRole, SeatType, ShowtimeStatus };
