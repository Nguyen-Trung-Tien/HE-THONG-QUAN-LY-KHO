import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/Dashboard';
import Orders from './components/OrderComponent/Orders';
import Shippers from './components/ShipperComponent/Shippers';
import Inventory from './components/InventoryComponent/Inventory';
import Statistics from './components/Statistics';
import Layout from './components/Layout';
import ProductList from './components/ProductsComponent/ProductList';
import CreateProduct from './components/ProductsComponent/CreateProduct';
import EditProduct from './components/ProductsComponent/EditProduct';
import SignIn from './components/SignIn';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './redux/slice/userSlice';
import SignUp from './components/SignUp';
import RequireAuth from './auth/RequireAuth';
import RoleGuard from './auth/RoleGuard';
import Profile from './components/Profile';
import Customer from './components/CustomerComponent/Customer';
import Suppliers from './components/SuppliersComponent/Suppliers';
import WarehouseManagement from './components/WarehouseManagement/WarehouseManagement';
import ProductDetail from './components/ProductsComponent/ProductDetail';
import Users from './components/UsersComponent/UsersComponent';
import Settings from './components/Settings';
import Notifications from './components/Notifications';

function App() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.currentUser);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			dispatch(login(JSON.parse(storedUser)));
		}
	}, [dispatch]);

	// Apply global theme
	useEffect(() => {
		if (user?.preferredTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [user?.preferredTheme]);

	return (
		<>
			<ToastContainer position='top-right' autoClose={3000} />

			<Routes>
				<Route path='/sign-in' element={<SignIn />} />
				<Route path='/sign-up' element={<SignUp />} />
				<Route path='/profile' element={<Profile />} />

				<Route element={<RequireAuth />}>
					<Route path='/' element={<Layout />}>
						<Route index element={<Dashboard />} />
						<Route path='products' element={<ProductList />} />
						<Route path='inventory' element={<Inventory />} />
						<Route path='orders' element={<Orders />} />
						<Route path='shippers' element={<Shippers />} />
						
						{/* Admin & Dev only routes */}
						<Route element={<RoleGuard allowedRoles={['admin', 'dev']} />}>
							<Route path="stats" element={<Statistics />} />
							<Route path='users' element={<Users />} />
						</Route>

						<Route path='suppliers' element={<Suppliers />} />
						<Route path='customer' element={<Customer />} />
						<Route
							path='WarehouseManagement'
							element={<WarehouseManagement />}
						/>
            <Route path='settings' element={<Settings />} />
            <Route path='notifications' element={<Notifications />} />
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;
