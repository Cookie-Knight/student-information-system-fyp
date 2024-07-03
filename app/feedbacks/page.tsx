'use client';

import React, { useState } from "react";
import Header from "@/app/components/Header";
import { db } from "@/lib/firebase/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

export default function Feedbacks() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Remove spaces and convert to lowercase for the document ID
            const docId = name.trim().toLowerCase().replace(/\s+/g, '-');
            const feedbackDoc = doc(collection(db, "feedbacks"), docId);
            await setDoc(feedbackDoc, {
                name,
                email,
                title,
                message,
                timestamp: new Date(),
            });
            setName("");
            setEmail("");
            setTitle("");
            setMessage("");
            alert("Feedback submitted successfully!");
        } catch (err) {
            console.error("Error adding document: ", err);
            setError("Error submitting feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Header />
            <div className="flex flex-col min-h-screen min-w-screen">
                <div className="grid h-20 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box font-bold text-2xl place-content-evenly">
                    Feedback Forms
                </div>
                <div className="divider txt-slate-400">
                    Write feedback to us on what can be improved on CampuSphere System.
                </div>
                <div className="grid h-95 card bg-base-300 p-4 ml-4 mr-4 mb-4 mt-4 rounded-box">
                    <form onSubmit={handleSubmit} className="overflow-x-auto">
                        <label className="input input-bordered flex items-center gap-2 mb-4">
                            Name
                            <input
                                type="text"
                                className="grow"
                                placeholder="Student Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mb-4">
                            Email
                            <input
                                type="email"
                                className="grow"
                                placeholder="campusphere@site.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label className="form-control w-full max-w-xs mb-4">
                            <div className="label">
                                <span className="label-text">Feedback Title</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered text-base w-full max-w-xs flex grow"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>
                        <textarea
                            className="textarea textarea-info w-full h-40 mb-4"
                            placeholder="What is your feedback?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
