"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdminAuthenticated } from "@/lib/auth";

export default function AdminRootRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: "var(--color-navy)"}}>
      <div className="text-lg" style={{color: "var(--color-lightgrey)"}}>Redirecting...</div>
    </div>
  );
}
