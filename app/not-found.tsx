import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { KnotDivider } from "@/components/ui/Divider";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-burgundy/8 text-burgundy">
        <Compass size={28} />
      </div>
      <h1 className="mt-6 font-display text-3xl">This page wandered off the guest list.</h1>
      <p className="mt-3 max-w-sm text-sm text-slate-soft">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get you back on track.
      </p>
      <KnotDivider className="my-8 w-48" />
      <div className="flex gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/vendors" variant="secondary">
          Browse vendors
        </Button>
      </div>
    </Container>
  );
}
