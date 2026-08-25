import React from 'react';
import { X, ShieldCheck, Check, Ban, Clock, Store, Mail, Phone, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminMerchantReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMerchantReviewModal: React.FC<AdminMerchantReviewModalProps> = ({ isOpen, onClose }) => {
  const { allApplications, approveMerchantApplication, rejectMerchantApplication } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative border border-gray-100 max-h-[85vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Admin Review - Phê duyệt Hồ sơ Mở Shop</h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {allApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Store className="w-8 h-8" />
              </div>
              <p className="text-gray-800 font-bold text-sm">Chưa có hồ sơ đăng ký mở Shop nào</p>
              <p className="text-gray-500 text-xs mt-1">Khi người dùng đăng ký tích chọn "Đăng ký mở Shop", hồ sơ sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            allApplications.map((app) => {
              const isPending = app.status === 'pending_review';
              const isApproved = app.status === 'approved';
              const isRejected = app.status === 'rejected';

              return (
                <div 
                  key={app.id || app.user_id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">{app.shop_name || `Shop ${app.full_name}`}</h4>
                        <span className="text-[11px] text-gray-400">ID: {app.user_id.slice(0, 8)}...</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          <span>Chờ Admin duyệt (Pending)</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã duyệt mở Shop (Merchant)</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-800 rounded-full text-xs font-bold border border-rose-200">
                          <Ban className="w-3.5 h-3.5 text-rose-600" />
                          <span>Từ chối</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Applicant Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600 bg-gray-50/70 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 truncate">
                      <UserIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate"><strong>Họ tên:</strong> {app.full_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate"><strong>SĐT:</strong> {app.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate"><strong>Email:</strong> {app.user_email}</span>
                    </div>
                  </div>

                  {/* Pipeline Action Buttons */}
                  {isPending && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => rejectMerchantApplication(app.id)}
                        className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs transition border border-rose-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Từ chối</span>
                      </button>

                      <button
                        onClick={() => approveMerchantApplication(app.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Phê duyệt mở Shop (Buyer ➔ Merchant)</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
