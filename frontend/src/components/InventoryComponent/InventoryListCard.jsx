import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { FiAlertTriangle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const InventoryListCard = ({ inventoryItems }) => {
	const navigate = useNavigate();

	const handleCreateOrder = () => {
		navigate('/WarehouseManagement', {
			state: { tab: 'importReceipts' },
		});
	};

	const lowStockItems = (inventoryItems || []).filter((item) => item.stock === 0 || item.stock < 10);

	return (
		<Card title="Sản phẩm cần nhập thêm" className="h-full shadow-soft-xl">
				<div className='space-y-4'>
					{lowStockItems.length === 0 ? (
						<div className="text-center py-10 opacity-30">
							<FiShoppingBag size={48} className="mx-auto mb-3" />
							<p className="text-[10px] font-black uppercase tracking-widest">Tồn kho hiện tại ổn định</p>
						</div>
					) : (
						lowStockItems.map((item) => (
							<div
								key={item.id}
								className='flex items-center justify-between p-4 bg-bg-subtle/30 dark:bg-white/[0.01] rounded-2xl border border-border/40 dark:border-dark-border/40 group hover:bg-white dark:hover:bg-dark-card transition-all duration-300'>
								<div className='flex items-center'>
									<div
										className={`size-10 rounded-xl ${
											item.stock === 0 ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
										} flex items-center justify-center mr-3 shadow-inner-sm`}>
										<FiAlertTriangle size={18} />
									</div>
									<div>
										<div className='text-xs font-black text-text-primary uppercase tracking-tight'>
											{item.name}
										</div>
										<div className='text-[9px] font-bold text-text-tertiary uppercase tracking-widest'>
											Mã hàng: {item.id}
										</div>
									</div>
								</div>
								<div className='text-right'>
									<div className='text-xs font-black text-text-primary tracking-tighter mb-1'>
										{item.stock} <span className="opacity-60">chiếc</span>
									</div>
									<Badge 
										variant={item.stock === 0 ? "error" : "warning"} 
										size="sm"
									>
										{item.stock === 0 ? 'Hết hàng' : 'Sắp hết'}
									</Badge>
								</div>
							</div>
						))
					)}
				</div>

				<div className="pt-6 mt-2 border-t border-border/40 dark:border-dark-border/40">
					<Button
						onClick={handleCreateOrder}
						variant="outline"
						className='w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest'
						rightIcon={<FiArrowRight />}
					>
						Tạo đơn nhập hàng
					</Button>
				</div>
		</Card>
	);
};

export default InventoryListCard;
