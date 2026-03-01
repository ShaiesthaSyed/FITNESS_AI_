export default function SkeletonCard({ height = 120, count = 1 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height, width: '100%', borderRadius: 'var(--radius-xl)' }} />
            ))}
        </>
    );
}
