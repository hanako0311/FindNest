import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';

export default function Header() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', isDarkMode);
  };

   const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar fluid={true} className='border-b-2'>
      <Link to="/" className="flex items-center">
        <img
          src="/FindNestRedLogo-W.svg"
          className="mr-2 h-6 sm:h-9"
          alt="FindNest Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          FindNest
        </span>
      </Link>
      <form onSubmit={handleSubmit} className="flex gap-2 md:order-2 ml-auto">
        {/* Search input for large screens */}
        <TextInput
          type='text'
          placeholder='Search...'
          icon={AiOutlineSearch}
          className='hidden lg:flex'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Search button for small screens */}
        <Button type="submit" className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
      </form>  
      <div className="flex md:order-2 ml-auto">
        <div className="hidden md:flex gap-2">
          <Link to="/" className="py-2 px-3 text-sm font-medium">
            Home
          </Link>
          <Link to="/features" className="py-2 px-3 text-sm font-medium">
            Features
          </Link>
          <Link to="/about-us" className="py-2 px-3 text-sm font-medium">
            About Us
          </Link>
          <Link to="/contact-us" className="py-2 px-3 text-sm font-medium">
            Contact Us
          </Link>
        </div>
        {/* Dark mode toggle button now always visible */}
        <div className='flex gap-2 md:order-2'>
        <Button
          onClick={handleThemeToggle}
          className='w-12 h-10 hidden sm:inline'
          color="gray"
          pill
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </Button>
        <Link to='/sign-in' /*className="hidden md:block"*/>
          <Button gradientDuoTone='redToYellow' outline>
            Sign In
          </Button>
        </Link>
        <Navbar.Toggle />
        </div>  
      </div>
      <Navbar.Collapse>
        {/* Collapsed items for mobile view */}
        <Link to="/" className="block py-2 pr-4 pl-3 text-sm md:hidden">
          Home
        </Link>
        <Link to="/features" className="block py-2 pr-4 pl-3 text-sm md:hidden">
          Features
        </Link>
        <Link to="/about-us" className="block py-2 pr-4 pl-3 text-sm md:hidden">
          About Us
        </Link>
        <Link to="/contact-us" className="block py-2 pr-4 pl-3 text-sm md:hidden">
          Contact Us
        </Link>
        {/* Mobile view sign-in link */}
        <Link to='/sign-in' className="block md:hidden">
          <Button gradientDuoTone='redToYellow' outline>
            Sign In
          </Button>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}