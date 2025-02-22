'use client'

import React, { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas';
import { ScrollText } from "lucide-react"

interface ReceiptProps {
    receiptId: string;
}

const Receipt = ({ receiptId }: ReceiptProps) => {
    const [receipt, setReceipt] = useState<any>(null);
    const receiptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchReceipt() {
            const res = await fetch(`/api/borrow/${receiptId}`); // Added leading slash
            const data = await res.json();
            setReceipt(data);
        }
        fetchReceipt();
    }, [receiptId]);

    const downloadReceipt = async () => {
        if (!receiptRef.current) return;

        try {
            // Temporarily make the receipt visible for capture
            const originalPosition = receiptRef.current.style.position;
            const originalVisibility = receiptRef.current.style.visibility;
            
            receiptRef.current.style.position = 'fixed';
            receiptRef.current.style.visibility = 'visible';
            receiptRef.current.style.zIndex = '-1000';
            
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2, // Better quality
                backgroundColor: '#111827', // Dark background
                logging: false
            });
            
            // Restore original styles
            receiptRef.current.style.position = originalPosition;
            receiptRef.current.style.visibility = originalVisibility;
            receiptRef.current.style.zIndex = '';

            // Create and trigger download
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `receipt_${receipt.receiptId}.png`;
            document.body.appendChild(link); // Necessary for Firefox
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error generating receipt:', error);
        }
    };

    if (!receipt) {
        return <p className='text-gray-500'>Loading receipt...</p>
    }

    return (
        <div className="flex flex-col items-center">
            {/* Receipt template for capture */}
            <div
                ref={receiptRef}
                className="fixed left-0 top-0 w-[500px] bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-700"
                style={{ visibility: 'hidden' }}
            >
                <h2 className="text-lg font-semibold text-gray-400">Receipt</h2>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-xl font-bold">📖 BookVault</span>
                </div>

                <h3 className="mt-4 text-lg font-semibold">Borrow Receipt</h3>
                <p className="text-sm">
                    Receipt ID: <span className="text-blue-400 font-semibold">#{receipt.receiptId}</span>
                </p>
                <p className="text-sm">Date Issued: <span className="text-gray-300">{receipt.issueDate}</span></p>

                <div className="mt-4">
                    <h4 className="text-gray-400 font-semibold">Book Details:</h4>
                    <p className="text-sm"><strong>Title:</strong> {receipt.bookTitle}</p>
                    <p className="text-sm"><strong>Author:</strong> {receipt.bookAuthor}</p>
                    <p className="text-sm"><strong>Genre:</strong> {receipt.bookGenre}</p>
                    <p className="text-sm"><strong>Borrowed On:</strong> {receipt.issueDate}</p>
                    <p className="text-sm"><strong>Due Date:</strong> {receipt.dueDate}</p>
                    <p className="text-sm"><strong>Duration:</strong> {receipt.duration} days</p>
                </div>

                <div className="mt-4 text-sm text-gray-400">
                    <h4 className="font-semibold">Terms</h4>
                    <ul className="list-disc list-inside">
                        <li>Please return the book by the due date.</li>
                        <li>Lost or damaged books may incur replacement costs.</li>
                    </ul>
                </div>

                <div className="mt-4 text-sm text-gray-400">
                    <p>Thank you for using <strong>BookVault</strong>!</p>
                    <p>Website: <a href="https://dkut.ac.ke/bookvault" className="text-blue-400 underline">dkut.ac.ke/bookvault</a></p>
                    <p>Email: <a href="mailto:bookvault@dkut.ac.ke" className="text-blue-400 underline">bookvault@dkut.ac.ke</a></p>
                </div>
            </div>

            {/* Download button */}
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    downloadReceipt();
                }}
                className="p-2 bg-transparent text-white rounded-md hover:text-blue-500"
            >
                <ScrollText size={24} />
            </button>
        </div>
    )
}

export default Receipt