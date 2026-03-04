'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPromptPage() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('http://localhost:5000/api/prompts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                title,
                description,
                content,
                category,
                tags: tags.split(',').map(t => t.trim())
            }),
        });

        if (!res.ok) {
            console.error('Failed to create prompt');
            return;
        }

        const data = await res.json();
        router.push(`/prompt/${data._id}`);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-6">Create New Prompt</h1>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-3 bg-gray-800 rounded"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Description"
                    className="w-full p-3 bg-gray-800 rounded"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <textarea
                    placeholder="Prompt Content"
                    className="w-full p-3 bg-gray-800 rounded h-40"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Category"
                    className="w-full p-3 bg-gray-800 rounded"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    className="w-full p-3 bg-gray-800 rounded"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-indigo-600 px-6 py-3 rounded hover:bg-indigo-700"
                >
                    Save Prompt
                </button>
            </form>
        </div>
    );
}
