"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchBlogThroughTitle } from '../utils/apiCalling';
import {  AllBlogType } from '../../../types';
import CategoriesPagesBlogs from '../components/CategoriesPagesBlogs';

const SearchComponent = () => {
    const router = useRouter();
    const params = useSearchParams();
    const [blogData, setBlogData] = useState<AllBlogType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.has("query")) {
            router.push('/allBlogs');
            return;
        }

        const searchValue = params.get("query") as string;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await searchBlogThroughTitle(searchValue);
                if (response && response.result && response.result.length > 0) {
                    setBlogData(response as AllBlogType);
                } else {
                    setBlogData(null);
                }
            } catch (error) {
                setError("Failed to fetch products. Please try again later.");
                setBlogData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params, router]);

    if (loading) {
        return <div className='text-2xl  font-bold mt-12 mb-80'>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!blogData || !blogData.result || blogData.result.length === 0) {
        return <div className="mt-40 text-center mb-80 text-3xl lg:text-4xl font-bold ">No blog found</div>;
    }

    return <CategoriesPagesBlogs blogData={blogData} />;
};

const SearchPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchComponent />
        </Suspense>
    );
};

export default SearchPage;