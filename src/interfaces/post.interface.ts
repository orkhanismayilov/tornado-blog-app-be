export interface Post {
  _id: string;
  title: string;
  content: string;
  imagePath: string;
  author: string;
  relatedPosts: Post[];
}
