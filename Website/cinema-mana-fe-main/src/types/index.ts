type Employee = {
  id: number;
  name: string;
  gender: EmployeeGender;
  phoneNumber: string;
  address: string;
  birthdate: string;
  role: EmployeeRole;
  identityCard: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  password: string;
};

enum EmployeeRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
}

enum EmployeeGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

type Movie = {
  id: number;
  poster: string;
  title: string;
  author: string;
  description: string;
  type: string;
  duration: number;
  releaseDate: string;
  isPublished: boolean;
  createAt: string;
  updateAt: string;
  showtimes: Showtime[];
};

type Showtime = {
  id: number;
  movieId: number;
  movie: Movie;
  theaterRoomId: number;
  theaterRoom: TheaterRoom;
  status: ShowtimeStatus;
  economyPrice: number;
  vipPrice: number;
  startTime: string;
  endTime: string;
  showtimeSeats: ShowtimeSeat[];
};

type Customer = {
  id: number;
  name: string;
  phoneNumber: string;
};

type Booking = {
  id: number;
  customer: Customer;
  customerId: number;
  employee: Employee;
  employeeId: number;
  showtime: Showtime;
  showtimeId: number;
  createdAt: Date;
  totalPrice: number;
  finalPrice: number;
};

type Ticket = {
  id: number;
  showtimeSeatId: number;
  seatNumber: string;
  price: number;
};

enum ShowtimeStatus {
  NEW = 'NEW',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED',
}

enum SeatType {
  VIP = 'VIP',
  ECONOMY = 'ECONOMY',
}
enum SeatStatus {
  MAINTAINED = 'MAINTAINED',
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  RESERVED = 'RESERVED',
}

type TheaterRoom = {
  id: number;
  roomNumber: number;
  capacity: number;
  numOfRows: number;
  numOfSeatsPerRow: number;
  isActive: boolean;
  seats: Seat[];
};

type Seat = {
  id: number;
  theaterRoomId: number;
  row: string;
  number: number;
  seatNumber: string;
  isActive: boolean;
  type: SeatType;
};

// type ShowtimeSeat = {
//   id: number;
//   theaterRoomId: number;
//   row: string;
//   number: number;
//   showtimeId?: number;
//   seatNumber: string;
//   isActive: boolean;
//   price: number;
//   status: SeatStatus;
//   type: SeatType;
// };

type ShowtimeSeat = Seat & {
  showtimeId?: number;
  price: number;
  status: SeatStatus;
};

export type {
  Ticket,
  Employee,
  Movie,
  Showtime,
  Seat,
  TheaterRoom,
  ShowtimeSeat,
  Customer,
  Booking,
};
export { SeatStatus, ShowtimeStatus, EmployeeGender, EmployeeRole, SeatType };
