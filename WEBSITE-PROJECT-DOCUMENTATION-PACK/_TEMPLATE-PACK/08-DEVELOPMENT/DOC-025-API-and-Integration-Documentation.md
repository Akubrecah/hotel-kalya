# DOC-025: API & Third-Party Integration Documentation

**Document ID:** `DOC-025`  
**Version:** `1.0`  
**Status:** `API SPECIFICATION`  

---

## 1. REST API Route Handlers

### 1.1 `GET /api/bookings`
- **Query Params:** `status` (optional: `all`, `confirmed`, `checked-in`, `completed`)
- **Response:** `{ success: true, count: number, reservations: ReservationRecord[] }`

### 1.2 `POST /api/bookings`
- **Body:** `{ guestName, guestPhone, guestEmail, roomType, checkIn, checkOut, guests, specialRequests }`
- **Response:** `{ success: true, bookingId: string, message: string }`

### 1.3 `POST /api/payments/mpesa`
- **Body:** `{ phoneNumber: "2547XXXXXXXX", amount: number, accountReference: string }`
- **Response:** `{ success: true, checkoutRequestId: string, customerMessage: string }`

### 1.4 `POST /api/payments/mpesa/callback`
- **Daraja Webhook:** Receives asynchronous Safaricom payment confirmation payload.

---

## 2. Sign-Off

**API Lead Engineer:** `___________________________` Date: `__________`  
