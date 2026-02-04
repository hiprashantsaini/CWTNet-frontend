import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import PostCreation from "../PostCreation";

const Posts = ({ user }) => {
    const [addPost, setAddPost] = useState(false);
    const [posts,setPosts]=useState([]);
    const [visiblePosts, setVisiblePosts] = useState(2);
    const getPosts=async()=>{
        try {
            const res=await axios.get(`http://localhost:5000/api/v1/posts/posts/${user._id}`,{withCredentials:true});
            if(res && res.data.posts){
                setPosts(res.data.posts);
            }
        } catch (error) {
            console.log("error:",error);
        }
    }



    useEffect(()=>{
        getPosts();
    },[addPost]);
    return (
        <div className="py-2 px-4 bg-white">
            <div className="flex justify-between items-center py-2">
                <h1 className="text-xl font-semibold">Posts</h1>
                <button onClick={() => setAddPost(true)} className="py-1 px-4 rounded-2xl border hover:border-2 border-blue-400 bg-white text-black font-semibold">Add a post</button>
            </div>
            {
                addPost && (
                    <div className="fixed inset-0 z-40 bg-gray-300 bg-opacity-35 flex justify-center items-center">
                        <div className="w-[98vw] sm:w-[60vw] md:w-[600px] relative">
                            <X onClick={()=>setAddPost(false)} className="absolute right-2 cursor-pointer hover:text-red-600"/>
                            <PostCreation user={user} setAddPost={setAddPost}/>
                        </div>
                    </div>
                )
            }
            <p className="w-full border border-b-gray-400"></p>
          
            <div className="py-2 px-1">
                {posts?.length > 0 ? (
                    posts.slice(0,visiblePosts).map((post) => (
                        <div key={post._id} className="border border-gray-300 p-4 mb-4 rounded-lg shadow-sm bg-white">
                            <div className="flex items-center gap-3">
                                <img
                                    src={post.author?.profilePicture || "/default-avatar.png"}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h2 className="font-semibold">{post.author?.name}</h2>
                                    <p className="text-sm text-gray-500">{post.author?.bio}</p>
                                </div>
                            </div>
                            <p className="mt-2">{post.content}</p>
                            {post.image && (
                                <img src={post.image} alt="Post" className="mt-2 w-full max-h-80 object-cover rounded-lg" />
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No posts available</p>
                )}
            </div>

            {visiblePosts < posts.length && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setVisiblePosts((prev) => prev + 2)}
                        className="py-2 px-6 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
                    >
                        Show More
                    </button>
                </div>
            )}
        </div>
    )
}

export default Posts;