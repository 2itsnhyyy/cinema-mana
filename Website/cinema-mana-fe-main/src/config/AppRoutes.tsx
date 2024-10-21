import EmployeeListPage from '@/pages/EmployeeListPage';
import LoginPage from '@/pages/LoginPage';
import MovieListPage from '@/pages/MovieListPage';
import NotFoundPage from '@/pages/NotFound';
import RegisterPage from '@/pages/RegisterPage';
import Welcome from '@/pages/Welcome';
import AboutPage from '@pages/AboutPage';
import ShowtimeListPage from '@/pages/ShowtimeListPage';
import TheaterRoomListPage from '@/pages/TheaterRoomListPage';
import TheaterRoomDetailPage from '@/pages/TheaterRoomDetailPage';
import ShowtimeDetailPage from '@/pages/ShowtimeDetailPage';
import ShowtimeBookingPage from '@/pages/ShowtimeBookingPage';
import BookingListPage from '@/pages/BookingListPage';

interface IRoute {
  path: string;
  page: JSX.Element;
}

const AppRoutes: IRoute[] = [
  {
    path: '/',
    page: <Welcome />,
  },
  {
    path: '/404',
    page: <NotFoundPage />,
  },
  {
    path: '/login',
    page: <LoginPage />,
  },
  {
    path: '/register',
    page: <RegisterPage />,
  },
  {
    path: '/about',
    page: <AboutPage />,
  },
  {
    path: '/employees',
    page: <EmployeeListPage />,
  },
  {
    path: '/movies',
    page: <MovieListPage />,
  },
  {
    path: '/showtimes',
    page: <ShowtimeListPage />,
  },
  {
    path: '/showtimes/:id',
    page: <ShowtimeDetailPage />,
  },
  {
    path: '/theater-rooms',
    page: <TheaterRoomListPage />,
  },
  {
    path: '/theater-rooms/:id',
    page: <TheaterRoomDetailPage />,
  },
  {
    path: '/booking-showtimes',
    page: <ShowtimeBookingPage />,
  },
  {
    path: '/bookings',
    page: <BookingListPage />,
  },
];

export default AppRoutes;
