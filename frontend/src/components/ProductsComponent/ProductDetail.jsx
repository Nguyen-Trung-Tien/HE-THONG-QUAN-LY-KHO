import { useEffect, useState } from 'react';
import upload_area from '../../assets/assets';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { FiBox, FiMapPin, FiTruck, FiAlertCircle, FiInfo, FiClock } from 'react-icons/fi';
import { cn } from '../../utils/cn';

const ProductDetail = ({ productData }) => {
	const [product, setProduct] = useState(productData);

	useEffect(() => {
		setProduct(productData);
	}, [productData]);

	if (!product) return <div className='p-10 text-center text-text-tertiary font-black uppercase tracking-widest'>Không tìm thấy sản phẩm.</div>;

	const priceFormatted = product.price
		? new Intl.NumberFormat('vi-VN', {
				style: 'currency',
				currency: 'VND',
		  }).format(Number(product.price))
		: '-';

	const imageSrc = product.image || upload_area;

	return (
		<div className='w-full animate-in fade-in zoom-in-95 duration-500'>
			<Card noPadding className="overflow-hidden border-none shadow-2xl shadow-black/5 dark:shadow-black/20">
				<div className='flex flex-col lg:flex-row'>
					{/* Image Section */}
					<div className='lg:w-2/5 bg-bg-subtle/30 dark:bg-white/[0.02] p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border/40 dark:border-dark-border/40'>
						<div className='relative group w-full aspect-square'>
							<div className='absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700' />
							<div className='relative h-full w-full rounded-[2rem] overflow-hidden border-4 border-white dark:border-dark-border shadow-xl'>
								<img
									src={imageSrc}
									alt={product.name}
									className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
								/>
							</div>
						</div>
					</div>

					{/* Info Section */}
					<div className='lg:w-3/5 p-8 sm:p-10'>
						<div className='flex flex-col sm:flex-row justify-between items-start gap-4 mb-8'>
							<div>
								<div className="flex items-center gap-x-3 mb-2">
									<Badge variant="primary" size="sm">{product.category || 'Chưa phân loại'}</Badge>
									<Badge variant={product.status === 'Hết hàng' ? 'error' : 'success'} size="sm">
										{product.status}
									</Badge>
								</div>
								<h1 className='text-3xl font-black text-text-primary uppercase tracking-tighter leading-none'>
									{product.name}
								</h1>
							</div>
							<div className='bg-primary/5 dark:bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20'>
								<span className='text-2xl font-black text-primary tracking-tighter'>
									{priceFormatted}
								</span>
							</div>
						</div>

						<div className='space-y-8'>
							{/* Stats Grid */}
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								{[
									{ label: 'Tồn kho', value: `${product.stock || 0} ${product.unit}`, icon: <FiBox />, color: 'text-primary', bg: 'bg-primary/5' },
									{ label: 'Vị trí', value: product.warehouseAddress || 'Khu A-01', icon: <FiMapPin />, color: 'text-info', bg: 'bg-info/5' },
									{ label: 'Nhà cung cấp', value: product.supplierName || 'N/A', icon: <FiTruck />, color: 'text-success', bg: 'bg-success/5' },
									{ label: 'Mức tối thiểu', value: product.minStock || '10', icon: <FiAlertCircle />, color: 'text-warning', bg: 'bg-warning/5' },
								].map((item, i) => (
									<div key={i} className='flex items-center gap-x-4 p-4 rounded-2xl bg-bg-subtle/40 dark:bg-white/[0.02] border border-border/40 dark:border-dark-border/40 group hover:border-primary/30 transition-all'>
										<div className={cn('size-10 rounded-xl flex items-center justify-center text-lg shadow-inner-sm', item.bg, item.color)}>
											{item.icon}
										</div>
										<div>
											<p className='text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-0.5'>{item.label}</p>
											<p className='text-xs font-bold text-text-primary uppercase truncate max-w-[120px]'>{item.value}</p>
										</div>
									</div>
								))}
							</div>

							{/* Description */}
							<div className='p-6 rounded-[1.5rem] bg-bg-subtle/20 dark:bg-white/[0.01] border border-border/30 dark:border-dark-border/40 relative overflow-hidden'>
								<div className="absolute top-0 right-0 p-3 text-primary/10">
									<FiInfo size={40} />
								</div>
								<h3 className='text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-3 flex items-center gap-x-2'>
									<span>Mô tả sản phẩm</span>
									<div className="h-px flex-1 bg-border/40 dark:bg-dark-border/40" />
								</h3>
								<p className='text-xs text-text-secondary font-medium leading-relaxed italic'>
									{product.description || 'Không có mô tả cho sản phẩm này.'}
								</p>
							</div>

							{/* Footer Info */}
							<div className='pt-6 border-t border-border/40 dark:border-dark-border/40 flex flex-col sm:flex-row justify-between items-center gap-4'>
								<div className="flex items-center gap-x-2 text-text-tertiary">
									<FiClock size={14} />
									<span className='text-[10px] font-bold uppercase tracking-tight'>
										Cập nhật lần cuối: {product.updatedAt ? new Date(product.updatedAt).toLocaleString('vi-VN') : 'N/A'}
									</span>
								</div>
								<div className="flex items-center gap-x-3 opacity-60">
									<div className="size-2 rounded-full bg-success animate-pulse" />
									<span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest italic">Hệ thống WMS Pro v3.0</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default ProductDetail;
