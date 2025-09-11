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
}

export default function AdminDashboardPage() {
	const [registrations, setRegistrations] = useState<Registration[]>([]);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Check authentication first
		if (!isAdminAuthenticated()) {
			router.replace("/admin/login");
			return;
		}
		fetchData();
	}, [router]);

	async function fetchData() {
		try {
			const [regRes, payRes, ticketRes] = await Promise.all([
				fetch('/api/admin/registrations'),
				fetch('/api/admin/payments'),
				fetch('/api/admin/tickets')
			]);
			if (regRes.ok) {
				const regData = await regRes.json();
				setRegistrations(regData.registrations || []);
			}
			if (payRes.ok) {
				const payData = await payRes.json();
				setPayments(payData.payments || []);
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
				<h3 className="text-xl font-semibold mb-4" style={{color: "var(--color-lightgrey)"}}>Registrations ({registrations.length})</h3>
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
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{registrations.map((reg, index) => (
									<tr key={`registration-${reg.orderId}-${index}`} className="hover:bg-white/5">
										<td className="px-6 py-4 font-mono text-sm font-medium" style={{color: "var(--color-gold)"}}>{reg.orderId}</td>
										<td className="px-6 py-4 text-sm">{reg.fullName}</td>
										<td className="px-6 py-4 text-sm">{reg.email}</td>
										<td className="px-6 py-4 text-sm">{reg.phone}</td>
										<td className="px-6 py-4 text-sm">{reg.memberId || '-'}</td>
										<td className="px-6 py-4 text-sm">{reg.ticketQuantity || 1}</td>
										<td className="px-6 py-4 text-sm">Rp {reg.amount.toLocaleString()}</td>
										<td className="px-6 py-4 text-sm">
											<span className={`px-2 py-1 rounded text-xs ${
												reg.status === 'paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
											}`}>
												{reg.status}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-400">
											{convertToJakartaTime(reg.createdAt)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Payments Table */}
			<div className="mb-8">
				<h3 className="text-xl font-semibold mb-4" style={{color: "var(--color-lightgrey)"}}>Payments ({payments.length})</h3>
				<div className="bg-white/5 rounded-lg backdrop-blur-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-white/10">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Transaction ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Method</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Paid At</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{payments.map((payment, index) => (
									<tr key={`payment-${payment.orderId}-${index}`} className="hover:bg-white/5">
										<td className="px-6 py-4 font-mono text-sm font-medium" style={{color: "var(--color-gold)"}}>{payment.orderId}</td>
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
				</div>
			</div>

			{/* Tickets Table */}
			<div className="mb-8">
				<h3 className="text-xl font-semibold mb-4" style={{color: "var(--color-lightgrey)"}}>E-Tickets ({tickets.length})</h3>
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
								{tickets.map((ticket, index) => (
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
											{convertToJakartaTime(ticket.createdAt ?? ticket.issuedAt ?? "")}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
