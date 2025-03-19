'use client'

import React, { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas';
import { ScrollText } from "lucide-react"

interface ReceiptData {
    receiptId: string;
    issueDate: string;
    bookTitle: string;
    bookAuthor: string;
    bookGenre: string;
    dueDate: string;
    duration: number;
    borrowerName: string;       
    registrationNumber: string;  
}

interface ReceiptProps {
    receiptId: string;
}

const Receipt = ({ receiptId }: ReceiptProps) => {
    const [receipt, setReceipt] = useState<ReceiptData | null>(null);
    const receiptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchReceipt() {
            const res = await fetch(`/api/borrow/${receiptId}`);
            const data = await res.json();
            setReceipt(data);
        }
        fetchReceipt();
    }, [receiptId]);

    const downloadReceipt = async () => {
        if (!receiptRef.current) return;

        try {
            const originalPosition = receiptRef.current.style.position;
            const originalVisibility = receiptRef.current.style.visibility;
            
            receiptRef.current.style.position = 'fixed';
            receiptRef.current.style.visibility = 'visible';
            receiptRef.current.style.zIndex = '-1000';
            
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2, 
                backgroundColor: '#111827',
                logging: false
            });
            
           
            receiptRef.current.style.position = originalPosition;
            receiptRef.current.style.visibility = originalVisibility;
            receiptRef.current.style.zIndex = '';

           
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `receipt_${receipt?.bookTitle || 'unknown'}.png`;
            document.body.appendChild(link);
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
    
                <div className="mt-4 border-t border-gray-700 pt-3">
                    <h4 className="font-semibold text-gray-400">Borrower Details:</h4>
                    <p className="text-sm"><strong>Name:</strong> {receipt.borrowerName}</p>
                    <p className="text-sm"><strong>Reg. Number:</strong> {receipt.registrationNumber}</p>
                </div>

                <div className="mt-4">
                    <h4 className="font-semibold text-gray-400">Book Details:</h4>
                    <p className="text-sm"><strong>Title:</strong> {receipt.bookTitle}</p>
                    <p className="text-sm"><strong>Author:</strong> {receipt.bookAuthor}</p>
                    <p className="text-sm"><strong>Genre:</strong> {receipt.bookGenre}</p>
                    <p className="text-sm"><strong>Borrowed On:</strong> {receipt.issueDate}</p>
                    <p className="text-sm"><strong>Due Date:</strong> {receipt.dueDate}</p>
                    <p className="text-sm"><strong>Duration:</strong> {receipt.duration} days</p>
                </div>

                <div className="mt-4 text-sm text-gray-400">
                    <h4 className="font-semibold">Terms</h4>
                    <ul className="list-inside list-disc ">
                        <li>Please return the book by the due date.</li>
                        <li>Lost or damaged books may incur replacement costs.</li>
                        <li>This receipt serves as proof of borrowing and must be presented when returning the book.</li>
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
                    e.preventDefault();
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