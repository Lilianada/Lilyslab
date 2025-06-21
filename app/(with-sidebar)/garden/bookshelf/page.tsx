import { getAllBooks, type Book } from "@/lib/books";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { BookOpen, Star } from "lucide-react";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const placeholderImage = "/images/book-placeholder.jpg"; // You'll need to add this image

export default function Page() {
  const books = getAllBooks();
  const readingBooks = books.filter((book) => book.status === "reading");
  const readBooks = books.filter((book) => book.status === "read");
  const toReadBooks = books.filter((book) => book.status === "to-read");

  return (
    <>
      <ScrollProgress color="bg-blue" height={3} glow={true} />

      <div className="min-h-screen animate-fade-in">
        <div className="container max-w-3xl mx-auto px-0 sm:px-4 pt-16 pb-8">
          <header className="mb-8">
            <span className="text-2xl">✳︎</span>
            <h1 className="mb-2 text-xl font-medium">My Bookshelf</h1>
            <div className="flex flex-col text-xs text-muted-foreground font-mono">
              <div>Created: 2025-04-20</div>
              <div>Last updated: 2025-06-15</div>
              <div>Inspired by: Digital Gardens</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              A collection of books I've read, am reading, or plan to read.
            </p>
          </header>

          {readingBooks.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-primary" />
                <h2 className="text-base font-medium">Currently Reading</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {readingBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}

          {readBooks.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-primary" />
                <h2 className="text-base font-medium">Read</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {readBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}

          {toReadBooks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-medium">Want to Read</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {toReadBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}

          <Footer />
        </div>
      </div>
    </>
  );
}

function BookCard({ book }: { book: Book }) {
  // Ensure we have a title for safety
  const title = book.title || "Untitled";
  const author = book.author || "Unknown Author";

  return (
    <Card className="flex flex-col border-border bg-card h-full overflow-hidden">
      {/* Book Cover with Aspect Ratio */}
      <div className="relative aspect-[4/5] w-full mb-2">
        <Image
          src={book.image || placeholderImage}
          alt={`Cover of ${title}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 40vw, (max-width: 1200px) 25vw, 16vw"
        />

        {/* Reading Status Badge */}
        <div
          className={`absolute top-0 right-0 px-1.5 py-0.5 text-[10px] font-medium text-white ${
            book.status === "reading"
              ? "bg-primary"
              : book.status === "to-read"
              ? "bg-muted-foreground"
              : "bg-primary/80"
          }`}
        >
          {book.status === "reading"
            ? "Reading"
            : book.status === "to-read"
            ? "Want to Read"
            : "Read"}
        </div>
      </div>

      {/* Book Details */}
      <div className="p-2 flex-1 flex flex-col">
        <h3 className="text-xs font-medium leading-tight mb-1" title={title}>
          {title.length > 20 ? `${title.substring(0, 18)}...` : title}
        </h3>
        <p className="text-[10px] text-muted-foreground mb-2">{author}</p>

        <div className="mt-auto flex items-center justify-between">
          {book.rating ? (
            <div className="text-[10px] font-medium bg-primary/10 px-1.5 py-0.5 rounded">
              {book.rating}/5
            </div>
          ) : (
            <div />
          )}

          <div className="text-[10px] text-muted-foreground">
            {book.url ? (
              <Link
                href={book.url}
                className="flex items-center text-primary hover:underline"
              >
                <span>Review</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </Link>
            ) : (
              <span className="text-muted-foreground/70">No review</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
