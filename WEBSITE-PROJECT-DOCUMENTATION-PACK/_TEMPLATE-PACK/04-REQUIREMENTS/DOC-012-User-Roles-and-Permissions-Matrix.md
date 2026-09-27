# DOC-012: User Roles & Permissions Matrix

**Document ID:** `DOC-012`  
**Version:** `1.0`  
**Status:** `APPROVED`  

---

## 1. Role Definitions

1. **Anonymous Visitor (`guest`):** Public browsing guest viewing marketing pages, menus, catalog, and location.
2. **Registered Customer (`customer`):** Authenticated account holder managing personal profile, saved favorites, and booking history.
3. **Operational Staff (`staff`):** Front-desk duty officers, kitchen supervisors, and reservations clerks.
4. **Super Administrator (`admin`):** General management, system configuration, and full data access.

---

## 2. Access Control Matrix

| Feature / Resource | Anonymous Visitor | Registered Customer | Operational Staff | Super Administrator |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Public Pages & Menus** | **READ** | **READ** | **READ** | **READ** |
| **Submit Booking / Place Order** | **CREATE** | **CREATE** | **CREATE** | **CREATE** |
| **Trigger M-Pesa STK Push** | **EXECUTE** | **EXECUTE** | **EXECUTE** | **EXECUTE** |
| **Access `/account` Folios** | NO ACCESS | **READ / UPDATE** | **READ** | **READ / UPDATE** |
| **Access `/admin` Console** | NO ACCESS | NO ACCESS | **READ** | **FULL ADMIN** |
| **Manage Reservations Desk** | NO ACCESS | NO ACCESS | **UPDATE (Check-in/out)**| **FULL CRUD** |
| **Operate KDS Kitchen Kanban** | NO ACCESS | NO ACCESS | **ADVANCE STATUS** | **FULL CRUD** |
| **Update Room Inventory & Housekeeping**| NO ACCESS | NO ACCESS | **UPDATE STATUS** | **FULL CRUD** |
| **Edit System Settings & Access Logs** | NO ACCESS | NO ACCESS | NO ACCESS | **FULL ADMIN** |

---

## 3. Enforcement Architecture

- Client-side route guarding via `AuthContext.tsx`.
- Automatic redirection of `staff` / `admin` users to `/admin` upon login.
- Dynamic navigation rendering: "Admin Portal" link rendered conditionally in navigation headers only when authenticated role equals `staff` or `admin`.

---

## 4. Sign-Off

**Client Approval:** `___________________________` Date: `__________`  
