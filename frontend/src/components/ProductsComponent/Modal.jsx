const Modal = ({ isOpen, onClose, children, title }) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			<div className='fixed inset-0 transition-opacity' onClick={onClose}>
				<div className='absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm'></div>
			</div>

			<div className='bg-white dark:bg-dark-card rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-lg sm:w-full z-10 border border-border/40 dark:border-dark-border/40'>
				<div className='px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='text-lg font-bold leading-6 text-text-primary'>
								{title}
							</h3>
							<button
								onClick={onClose}
								className='text-text-tertiary hover:text-text-secondary focus:outline-none transition-colors'>
								<span className='sr-only'>Close</span>
								<svg
									className='h-6 w-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>
						</div>
						{children}
					</div>
				</div>
			</div>
	);
};

export default Modal;
