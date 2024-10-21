import { FaPeopleGroup } from 'react-icons/fa6';
import { HiHome } from 'react-icons/hi';
import { MdMovieEdit, MdSlideshow, MdHistory } from 'react-icons/md';
import { FaWarehouse } from 'react-icons/fa';
import { IoTicket } from "react-icons/io5";

const MenuItems = {
  routes: [
    {
      path: '/',
      name: 'Welcome',
      icon: (
        <span role='img'>
          <HiHome size={20} />
        </span>
      ),
    },
    {
      path: '/booking-showtimes',
      name: 'Booking showtime',
      icon: (
        <span role='img'>
          <IoTicket size={20} />
        </span>
      ),
    },
    {
      path: '/employees',
      name: 'Employees',
      icon: (
        <span role='img'>
          <FaPeopleGroup size={20} />
        </span>
      ),
    },
    {
      path: '/movies',
      name: 'Movies management',
      icon: (
        <span role='img'>
          <MdMovieEdit size={20} />
        </span>
      ),
    },
    {
      path: '/theater-rooms',
      name: 'Rooms management',
      icon: (
        <span role='img'>
          <FaWarehouse size={20} />
        </span>
      ),
    },
    {
      path: '/showtimes',
      name: 'Showtimes management',
      icon: (
        <span role='img'>
          <MdSlideshow size={20} />
        </span>
      ),
    },
    {
      path: '/bookings',
      name: 'Booking History',
      icon: (
        <span role='img'>
          <MdHistory size={20} />
        </span>
      ),
    },
  ],
};

export default MenuItems;
