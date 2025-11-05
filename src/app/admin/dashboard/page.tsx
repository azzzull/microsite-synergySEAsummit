"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { convertToJakartaTime } from "@/lib/timezone";

interface Registration {
	orderId: string;
	fullName: string;
	email: string;
	phone: string;
	memberId?: string;
	ticketQuantity?: number;
	amount: number;
	originalAmount?: number;
	discountAmount?: number;
	voucherCode?: string;
	status: string;
	createdAt: string;
}

interface Payment {
	orderId: string;
	amount: number;
	status: string;
	transactionId?: string;
	paymentMethod?: string;
	paidAt?: string;
	createdAt: string;
	fullName?: string; // Added for displaying participant name
	email?: string; // Added for search and display
}

interface Ticket {
	id?: string;
	ticketId: string;
	ticketCode?: string;
	orderId: string;
	participantName: string;
	participantEmail: string;
	participantPhone?: string;
	eventName?: string;
	eventDate?: string;
	eventLocation?: string;
	emailSent: boolean;
	emailSentAt?: string;
	createdAt: string;
	issuedAt?: string;
	updatedAt?: string;
	status?: string;
	fullName?: string;
	email?: string;
	validationStatus?: 'used' | 'unused';
	validatedAt?: string;
	usedCount?: number;
}

export default function AdminDashboardPage() {
	const [registrations, setRegistrations] = useState<Registration[]>([]);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [loading, setLoading] = useState(true);
	
	// Search state
	const [registrationSearchQuery, setRegistrationSearchQuery] = useState('');
	const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
	const [ticketSearchQuery, setTicketSearchQuery] = useState('');
	const [scannedTicketSearchQuery, setScannedTicketSearchQuery] = useState('');
	
	// Pagination states
	const [registrationPage, setRegistrationPage] = useState(1);
	const [paymentPage, setPaymentPage] = useState(1);
	const [ticketPage, setTicketPage] = useState(1);
	const [scannedTicketPage, setScannedTicketPage] = useState(1);
	const itemsPerPage = 5;
	
	const router = useRouter();

	// CSV Export utility functions
	const exportToCSV = (data: any[], filename: string) => {
		if (!data || data.length === 0) {
			alert('No data to export');
			return;
		}

		// Get headers from first object
		const headers = Object.keys(data[0]);
		
		// Create CSV with semicolon separator for better Excel compatibility
		const csvRows = [];
		
		// Header row
		csvRows.push(headers.join(';'));
		
		// Data rows
		data.forEach(row => {
			const values = headers.map(header => {
				let value = row[header];
				if (value === null || value === undefined) {
					return '';
				}
				// Clean the value and remove any problematic characters
				return String(value).replace(/;/g, ',').replace(/\r?\n/g, ' ');
			});
			csvRows.push(values.join(';'));
		});

		const csvContent = csvRows.join('\n');

		// Create and download file with proper encoding
		const blob = new Blob(['\ufeff' + csvContent], { 
			type: 'text/csv;charset=utf-8;' 
		});
		
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		
		link.setAttribute('href', url);
		link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		
		URL.revokeObjectURL(url);
	};

	// Format data for CSV export
	const formatRegistrationDataForCSV = (registrations: Registration[]) => {
		return registrations.map((reg, index) => ({
			'No': index + 1,
			'Order ID': reg.orderId || '',
			'Full Name': reg.fullName || '',
			'Email': reg.email || '',
			'Phone': reg.phone || '',
			'Member ID': reg.memberId || '',
			'Ticket Quantity': reg.ticketQuantity || 1,
			'Original Amount IDR': (reg.originalAmount || reg.amount) || 0,
			'Voucher Code': reg.voucherCode || '',
			'Discount Amount IDR': (reg.discountAmount || 0),
			'Final Amount IDR': reg.amount || 0,
			'Payment Status': reg.status || '',
			'Created At Jakarta Time': reg.createdAt ? (typeof reg.createdAt === 'string' && reg.createdAt.includes('WIB') ? reg.createdAt : convertToJakartaTime(reg.createdAt)) : 'N/A'
		}));
	};

	const formatPaymentDataForCSV = (payments: Payment[]) => {
		return payments.map((payment, index) => ({
			'No': index + 1,
			'Order ID': payment.orderId || '',
			'Amount IDR': payment.amount || 0,
			'Payment Status': payment.status || '',
			'Transaction ID': payment.transactionId || '',
			'Payment Method': payment.paymentMethod || 'DOKU',
			'Paid At Jakarta Time': payment.paidAt ? convertToJakartaTime(payment.paidAt) : '',
			'Created At Jakarta Time': payment.createdAt ? convertToJakartaTime(payment.createdAt) : 'N/A'
		}));
	};

	const formatTicketDataForCSV = (tickets: Ticket[]) => {
		return tickets.map((ticket, index) => ({
			'No': index + 1,
			'Ticket ID': ticket.ticketId || ticket.ticketCode || '',
			'Order ID': ticket.orderId || '',
			'Participant Name': ticket.participantName || ticket.fullName || '',
			'Participant Email': ticket.participantEmail || ticket.email || '',
			'Participant Phone': ticket.participantPhone || '',
			'Event Name': ticket.eventName || 'Synergy SEA Summit 2025',
			'Event Date': ticket.eventDate || '2025-11-08',
			'Event Location': ticket.eventLocation || 'The Stones Hotel Legian Bali',
			'Email Sent': ticket.emailSent ? 'Yes' : 'No',
			'Email Sent At Jakarta Time': ticket.emailSentAt ? convertToJakartaTime(ticket.emailSentAt) : '',
			'Ticket Status': ticket.status || 'Active',
			'Created At Jakarta Time': ticket.createdAt ? (typeof ticket.createdAt === 'string' && ticket.createdAt.includes('WIB') ? ticket.createdAt : convertToJakartaTime(ticket.createdAt)) : (ticket.issuedAt ? (typeof ticket.issuedAt === 'string' && ticket.issuedAt.includes('WIB') ? ticket.issuedAt : convertToJakartaTime(ticket.issuedAt)) : 'N/A'),
			'Updated At Jakarta Time': ticket.updatedAt ? (typeof ticket.updatedAt === 'string' && ticket.updatedAt.includes('WIB') ? ticket.updatedAt : convertToJakartaTime(ticket.updatedAt)) : 'N/A'
		}));
	};

	// Export handlers
	const handleExportRegistrations = () => {
		const csvData = formatRegistrationDataForCSV(registrations);
		exportToCSV(csvData, 'synergy_registrations');
	};

	const handleExportPayments = () => {
		const csvData = formatPaymentDataForCSV(payments);
		exportToCSV(csvData, 'synergy_payments');
	};

	const handleExportTickets = () => {
		const csvData = formatTicketDataForCSV(tickets);
		exportToCSV(csvData, 'synergy_tickets');
	};

	useEffect(() => {
		// Check authentication first
		if (!isAdminAuthenticated()) {
			router.replace("/admin/login");
			return;
		}
		fetchData();
	}, [router]);

	// Pagination helper functions
	const paginate = (items: any[], currentPage: number) => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return items.slice(startIndex, startIndex + itemsPerPage);
	};

	const getTotalPages = (itemCount: number) => {
		return Math.ceil(itemCount / itemsPerPage);
	};

	const PaginationControls = ({ currentPage, totalPages, onPageChange, label }: {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
		label: string;
	}) => {
		if (totalPages <= 1) return null;

		// Smart pagination: show max 7 page buttons
		const getVisiblePages = () => {
			const delta = 2; // Show 2 pages before and after current page
			const range = [];
			
			// Always show first page
			if (currentPage > delta + 2) {
				range.push(1);
				if (currentPage > delta + 3) {
					range.push('...');
				}
			}
			
			// Show pages around current page
			const start = Math.max(1, currentPage - delta);
			const end = Math.min(totalPages, currentPage + delta);
			
			for (let i = start; i <= end; i++) {
				range.push(i);
			}
			
			// Always show last page
			if (currentPage < totalPages - delta - 1) {
				if (currentPage < totalPages - delta - 2) {
					range.push('...');
				}
				range.push(totalPages);
			}
			
			return range;
		};

		const visiblePages = getVisiblePages();

		return (
			<div className="flex items-center justify-between mt-4 px-6 py-3 border-t border-gray-600">
				<span className="text-sm text-gray-400">
					{label} - Page {currentPage} of {totalPages} (showing {Math.min(itemsPerPage, totalPages * itemsPerPage - (currentPage - 1) * itemsPerPage)} items)
				</span>
				<div className="flex gap-2 items-center">
					<button
						onClick={() => onPageChange(1)}
						disabled={currentPage === 1}
						className="px-3 py-1 rounded text-sm bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						style={{color: "var(--color-lightgrey)"}}
						title="First Page"
					>
						««
					</button>
					
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="px-3 py-1 rounded text-sm bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						style={{color: "var(--color-lightgrey)"}}
					>
						‹ Prev
					</button>
					
					{/* Smart page numbers */}
					{visiblePages.map((page, index) => (
						<span key={index}>
							{page === '...' ? (
								<span className="px-3 py-1 text-gray-500">...</span>
							) : (
								<button
									onClick={() => onPageChange(page as number)}
									className={`px-3 py-1 rounded text-sm transition-all min-w-[32px] ${
										currentPage === page 
											? 'text-[var(--color-navy)] font-medium'
											: 'hover:bg-white/20'
									}`}
									style={{
										backgroundColor: currentPage === page ? "var(--color-gold)" : "transparent",
										color: currentPage === page ? "var(--color-navy)" : "var(--color-lightgrey)"
									}}
								>
									{page}
								</button>
							)}
						</span>
					))}
					
					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="px-3 py-1 rounded text-sm bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						style={{color: "var(--color-lightgrey)"}}
					>
						Next ›
					</button>
					
					<button
						onClick={() => onPageChange(totalPages)}
						disabled={currentPage === totalPages}
						className="px-3 py-1 rounded text-sm bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						style={{color: "var(--color-lightgrey)"}}
						title="Last Page"
					>
						»»
					</button>
				</div>
			</div>
		);
	};

	async function fetchData() {
		try {
			const [regRes, payRes, ticketRes] = await Promise.all([
				fetch('/api/admin/registrations'),
				fetch('/api/admin/payments'),
				fetch('/api/admin/tickets')
			]);
			
			let registrationData: Registration[] = [];
			let paymentData: Payment[] = [];
			
			if (regRes.ok) {
				const regData = await regRes.json();
				registrationData = regData.registrations || [];
				setRegistrations(registrationData);
			}
			if (payRes.ok) {
				const payData = await payRes.json();
				paymentData = payData.payments || [];
				
				// Enrich payment data with participant names from registrations
				const enrichedPayments = paymentData.map(payment => {
					const registration = registrationData.find(reg => reg.orderId === payment.orderId);
					return {
						...payment,
						fullName: registration?.fullName,
						email: registration?.email
					};
				});
				
				setPayments(enrichedPayments);
			}
			if (ticketRes.ok) {
				const ticketData = await ticketRes.json();
				setTickets(ticketData.tickets || []);
			}
		} catch (error) {
			// handle error
		} finally {
			setLoading(false);
		}
	}

	// Filter tickets based on search query
	const filteredTickets = tickets.filter(ticket => {
		if (!ticketSearchQuery) return true;
		
		const query = ticketSearchQuery.toLowerCase();
		const ticketId = (ticket.ticketId || ticket.ticketCode || '').toLowerCase();
		const orderId = (ticket.orderId || '').toLowerCase();
		const participantName = (ticket.participantName || ticket.fullName || '').toLowerCase();
		const participantEmail = (ticket.participantEmail || ticket.email || '').toLowerCase();
		
		return ticketId.includes(query) || 
		       orderId.includes(query) || 
		       participantName.includes(query) || 
		       participantEmail.includes(query);
	});

	// Filter scanned tickets (status='used')
	const scannedTickets = tickets.filter(ticket => ticket.validationStatus === 'used');
	
	const filteredScannedTickets = scannedTickets.filter(ticket => {
		if (!scannedTicketSearchQuery) return true;
		
		const query = scannedTicketSearchQuery.toLowerCase();
		const ticketId = (ticket.ticketId || ticket.ticketCode || '').toLowerCase();
		const participantName = (ticket.participantName || ticket.fullName || '').toLowerCase();
		
		return ticketId.includes(query) || participantName.includes(query);
	});

	// Filter registrations based on search query
	const filteredRegistrations = registrations.filter(registration => {
		if (!registrationSearchQuery) return true;
		
		const query = registrationSearchQuery.toLowerCase();
		const orderId = (registration.orderId || '').toLowerCase();
		const fullName = (registration.fullName || '').toLowerCase();
		const email = (registration.email || '').toLowerCase();
		const phone = (registration.phone || '').toLowerCase();
		const memberId = (registration.memberId || '').toLowerCase();
		
		return orderId.includes(query) || 
		       fullName.includes(query) || 
		       email.includes(query) || 
		       phone.includes(query) || 
		       memberId.includes(query);
	});

	// Filter payments based on search query
	const filteredPayments = payments.filter(payment => {
		if (!paymentSearchQuery) return true;
		
		const query = paymentSearchQuery.toLowerCase();
		const orderId = (payment.orderId || '').toLowerCase();
		const transactionId = (payment.transactionId || '').toLowerCase();
		const paymentMethod = (payment.paymentMethod || '').toLowerCase();
		const fullName = (payment.fullName || '').toLowerCase();
		const email = (payment.email || '').toLowerCase();
		
		return orderId.includes(query) || 
		       transactionId.includes(query) || 
		       paymentMethod.includes(query) ||
		       fullName.includes(query) ||
		       email.includes(query);
	});

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="text-lg" style={{color: "var(--color-lightgrey)"}}>Loading admin data...</div>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold mb-6" style={{color: "var(--color-gold)"}}>Dashboard Overview</h2>

			{/* Registrations Table */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold" style={{color: "var(--color-lightgrey)"}}>
						Registrations ({filteredRegistrations.length} {registrationSearchQuery ? 'found' : 'total'})
					</h3>
					
					{/* Search Box */}
					<div className="relative w-96">
						<input
							type="text"
							placeholder="Search by Order ID, Name, Email, Phone, or Member ID..."
							value={registrationSearchQuery}
							onChange={(e) => {
								setRegistrationSearchQuery(e.target.value);
								setRegistrationPage(1); // Reset to first page on search
							}}
							className="w-full px-4 py-2 pl-10 bg-white/10 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
							style={{color: "var(--color-lightgrey)"}}
						/>
						<svg 
							className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						{registrationSearchQuery && (
							<button
								onClick={() => {
									setRegistrationSearchQuery('');
									setRegistrationPage(1);
								}}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
				</div>
				<div className="bg-white/5 rounded-lg backdrop-blur-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-white/10">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Member ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Qty</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Original</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Voucher</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Final</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{paginate(filteredRegistrations, registrationPage).map((reg, index) => (
									<tr key={`registration-${reg.orderId}-${index}`} className="hover:bg-white/5">
										<td className="px-6 py-4 font-mono text-sm font-medium" style={{color: "var(--color-gold)"}}>{reg.orderId}</td>
										<td className="px-6 py-4 text-sm">{reg.fullName}</td>
										<td className="px-6 py-4 text-sm">{reg.email}</td>
										<td className="px-6 py-4 text-sm">{reg.phone}</td>
										<td className="px-6 py-4 text-sm">{reg.memberId || '-'}</td>
										<td className="px-6 py-4 text-sm">{reg.ticketQuantity || 1}</td>
										<td className="px-6 py-4 text-sm">
											{reg.originalAmount ? `Rp ${reg.originalAmount.toLocaleString()}` : `Rp ${reg.amount.toLocaleString()}`}
										</td>
										<td className="px-6 py-4 text-sm">
											{reg.voucherCode ? (
												<span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-mono">
													{reg.voucherCode}
												</span>
											) : (
												<span className="text-gray-500">-</span>
											)}
										</td>
										<td className="px-6 py-4 text-sm">
											{reg.discountAmount && reg.discountAmount > 0 ? (
												<span className="text-green-400 font-medium">
													-Rp {reg.discountAmount.toLocaleString()}
												</span>
											) : (
												<span className="text-gray-500">-</span>
											)}
										</td>
										<td className="px-6 py-4 text-sm font-medium">
											Rp {reg.amount.toLocaleString()}
											{reg.discountAmount && reg.discountAmount > 0 && (
												<div className="text-xs text-green-400">
													({Math.round((reg.discountAmount / (reg.originalAmount || reg.amount)) * 100)}% off)
												</div>
											)}
										</td>
										<td className="px-6 py-4 text-sm">
											<span className={`px-2 py-1 rounded text-xs ${
												reg.status === 'paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
											}`}>
												{reg.status}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-400">
											{reg.createdAt ? (typeof reg.createdAt === 'string' && reg.createdAt.includes('WIB') ? reg.createdAt : convertToJakartaTime(reg.createdAt)) : 'N/A'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<PaginationControls
						currentPage={registrationPage}
						totalPages={getTotalPages(filteredRegistrations.length)}
						onPageChange={setRegistrationPage}
						label="Registrations"
					/>
					{/* Export CSV Button */}
					<div className="flex justify-end px-6 py-3 border-t border-gray-600">
						<button
							onClick={handleExportRegistrations}
							className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:opacity-90"
							style={{
								backgroundColor: "var(--color-gold)",
								color: "var(--color-navy)"
							}}
							disabled={registrations.length === 0}
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Export to CSV ({registrations.length} records)
						</button>
					</div>
				</div>
			</div>

			{/* Payments Table */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold" style={{color: "var(--color-lightgrey)"}}>
						Payments ({filteredPayments.length} {paymentSearchQuery ? 'found' : 'total'})
					</h3>
					
					{/* Search Box */}
					<div className="relative w-96">
						<input
							type="text"
							placeholder="Search by Order ID, Name, Transaction ID, or Method..."
							value={paymentSearchQuery}
							onChange={(e) => {
								setPaymentSearchQuery(e.target.value);
								setPaymentPage(1); // Reset to first page on search
							}}
							className="w-full px-4 py-2 pl-10 bg-white/10 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
							style={{color: "var(--color-lightgrey)"}}
						/>
						<svg 
							className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						{paymentSearchQuery && (
							<button
								onClick={() => {
									setPaymentSearchQuery('');
									setPaymentPage(1);
								}}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
				</div>
				<div className="bg-white/5 rounded-lg backdrop-blur-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-white/10">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Transaction ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Method</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Paid At</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{paginate(filteredPayments, paymentPage).map((payment, index) => (
									<tr key={`payment-${payment.orderId}-${index}`} className="hover:bg-white/5">
										<td className="px-6 py-4 font-mono text-sm font-medium" style={{color: "var(--color-gold)"}}>{payment.orderId}</td>
										<td className="px-6 py-4 text-sm">{payment.fullName || '-'}</td>
										<td className="px-6 py-4 text-sm">Rp {payment.amount.toLocaleString()}</td>
										<td className="px-6 py-4 text-sm">
											<span className={`px-2 py-1 rounded text-xs ${
												payment.status === 'success' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
											}`}>
												{payment.status}
											</span>
										</td>
										<td className="px-6 py-4 text-sm">{payment.transactionId || '-'}</td>
										<td className="px-6 py-4 text-sm">{payment.paymentMethod || '-'}</td>
										<td className="px-6 py-4 text-sm text-gray-400">
											{payment.paidAt ? convertToJakartaTime(payment.paidAt) : '-'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<PaginationControls
						currentPage={paymentPage}
						totalPages={getTotalPages(filteredPayments.length)}
						onPageChange={setPaymentPage}
						label="Payments"
					/>
					{/* Export CSV Button */}
					<div className="flex justify-end px-6 py-3 border-t border-gray-600">
						<button
							onClick={handleExportPayments}
							className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:opacity-90"
							style={{
								backgroundColor: "var(--color-gold)",
								color: "var(--color-navy)"
							}}
							disabled={payments.length === 0}
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Export to CSV ({payments.length} records)
						</button>
					</div>
				</div>
			</div>

			{/* Scanned Tickets Table */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold" style={{color: "var(--color-lightgrey)"}}>
						Scanned Tickets ({filteredScannedTickets.length} {scannedTicketSearchQuery ? 'found' : 'total'})
					</h3>
					
					{/* Search Box */}
					<div className="relative w-96">
						<input
							type="text"
							placeholder="Search by Ticket ID or Name..."
							value={scannedTicketSearchQuery}
							onChange={(e) => {
								setScannedTicketSearchQuery(e.target.value);
								setScannedTicketPage(1); // Reset to first page on search
							}}
							className="w-full px-4 py-2 pl-10 bg-white/10 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
							style={{color: "var(--color-lightgrey)"}}
						/>
						<svg 
							className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						{scannedTicketSearchQuery && (
							<button
								onClick={() => {
									setScannedTicketSearchQuery('');
									setScannedTicketPage(1);
								}}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
				</div>
				<div className="bg-white/5 rounded-lg backdrop-blur-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-white/10">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ticket Code</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Participant Name</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Scanned At</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{filteredScannedTickets.length === 0 ? (
									<tr>
										<td colSpan={4} className="px-6 py-8 text-center text-gray-400">
											{scannedTicketSearchQuery ? 'No scanned tickets found matching your search' : 'No tickets have been scanned yet'}
										</td>
									</tr>
								) : (
									paginate(filteredScannedTickets, scannedTicketPage).map((ticket, index) => (
										<tr key={`scanned-${ticket.ticketId || ticket.id || index}`} className="hover:bg-white/5">
											<td className="px-6 py-4 font-mono text-sm font-medium" style={{color: "var(--color-gold)"}}>
												{ticket.ticketId || ticket.ticketCode || 'N/A'}
											</td>
											<td className="px-6 py-4 text-sm">{ticket.participantName || ticket.fullName || 'N/A'}</td>
											<td className="px-6 py-4 text-sm text-gray-400">
												{ticket.validatedAt ? new Date(ticket.validatedAt).toLocaleString('id-ID', { 
													timeZone: 'Asia/Jakarta',
													year: 'numeric',
													month: '2-digit',
													day: '2-digit',
													hour: '2-digit',
													minute: '2-digit',
													second: '2-digit',
													hour12: false
												}) : 'N/A'}
											</td>
											<td className="px-6 py-4 text-sm">
												<span className="px-2 py-1 rounded text-xs bg-orange-900 text-orange-300">
													Used
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
					{filteredScannedTickets.length > 0 && (
						<PaginationControls
							currentPage={scannedTicketPage}
							totalPages={getTotalPages(filteredScannedTickets.length)}
							onPageChange={setScannedTicketPage}
							label="Scanned Tickets"
						/>
					)}
				</div>
			</div>

			{/* Tickets Table */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold" style={{color: "var(--color-lightgrey)"}}>
						E-Tickets ({filteredTickets.length} {ticketSearchQuery ? 'found' : 'total'})
					</h3>
					
					{/* Search Box */}
					<div className="relative w-96">
						<input
							type="text"
							placeholder="Search by Ticket ID, Order ID, Name, or Email..."
							value={ticketSearchQuery}
							onChange={(e) => {
								setTicketSearchQuery(e.target.value);
								setTicketPage(1); // Reset to first page on search
							}}
							className="w-full px-4 py-2 pl-10 bg-white/10 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
							style={{color: "var(--color-lightgrey)"}}
						/>
						<svg 
							className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						{ticketSearchQuery && (
							<button
								onClick={() => {
									setTicketSearchQuery('');
									setTicketPage(1);
								}}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
				</div>
				<div className="bg-white/5 rounded-lg backdrop-blur-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-white/10">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ticket ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Participant</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email Sent</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{paginate(filteredTickets, ticketPage).map((ticket, index) => (
									<tr key={`ticket-${ticket.ticketId || ticket.id || index}`} className="hover:bg-white/5">
										<td className="px-6 py-4 font-mono text-sm font-medium" style={{color: "var(--color-gold)"}}>
											{ticket.ticketId || ticket.ticketCode || 'N/A'}
										</td>
										<td className="px-6 py-4 text-sm">{ticket.orderId || 'N/A'}</td>
										<td className="px-6 py-4 text-sm">{ticket.participantName || ticket.fullName || 'N/A'}</td>
										<td className="px-6 py-4 text-sm">{ticket.participantEmail || ticket.email || 'N/A'}</td>
										<td className="px-6 py-4 text-sm">
											<span className={`px-2 py-1 rounded text-xs ${
												ticket.emailSent ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
											}`}>
												{ticket.emailSent ? 'Sent' : 'Not Sent'}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-400">
											{ticket.createdAt ? (typeof ticket.createdAt === 'string' && ticket.createdAt.includes('WIB') ? ticket.createdAt : convertToJakartaTime(ticket.createdAt)) : 
											 ticket.issuedAt ? (typeof ticket.issuedAt === 'string' && ticket.issuedAt.includes('WIB') ? ticket.issuedAt : convertToJakartaTime(ticket.issuedAt)) : 
											 'N/A'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<PaginationControls
						currentPage={ticketPage}
						totalPages={getTotalPages(filteredTickets.length)}
						onPageChange={setTicketPage}
						label="E-Tickets"
					/>
					{/* Export CSV Button */}
					<div className="flex justify-end px-6 py-3 border-t border-gray-600">
						<button
							onClick={handleExportTickets}
							className="px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:opacity-90"
							style={{
								backgroundColor: "var(--color-gold)",
								color: "var(--color-navy)"
							}}
							disabled={tickets.length === 0}
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Export to CSV ({tickets.length} records)
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
