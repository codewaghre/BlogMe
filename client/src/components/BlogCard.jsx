import React from 'react';

import moment from 'moment';
import { Link } from 'react-router-dom';

import { FaRegCalendarAlt } from 'react-icons/fa';
import { Card, CardContent } from './ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

import { RouteBlogDetails } from '@/helper/RouteName';
import { useSelector } from 'react-redux';

function BlogCard({ props }) {

    const category_slug = props.category.slug;
    const slug = props.slug;

    return (
        <div>
            <Link to={RouteBlogDetails(category_slug, slug)}>
                <Card className="pt-3 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="flex flex-col flex-grow p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex justify-between items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={props?.author?.avatar || " "} />
                                </Avatar>
                                <span className="text-sm">{props?.author?.name}</span>
                            </div>
                            {props?.author?.role === 'admin' && (
                                <Badge variant="outline" className="bg-violet-500 text-xs">
                                    Admin
                                </Badge>
                            )}
                        </div>

                        {/* Image Section */}
                        <div className="my-2 flex justify-center items-center flex-grow">
                            <img
                                src={props.featuredImage}
                                className="rounded w-full h-25 object-cover"
                                alt={props.title}
                            />
                        </div>

                        <div>
                            <p className="flex items-center gap-2 mb-1 text-sm">
                                <FaRegCalendarAlt className="text-sm" />
                                <span>{moment(props.createdAt).format('DD-MM-YYYY')}</span>
                            </p>
                            <h2 className="text-lg font-bold line-clamp-2">{props.title}</h2>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}

export default BlogCard;