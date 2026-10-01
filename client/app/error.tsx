'use client';

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <>
      <p>Не удалось загрузить данные</p>
      <button onClick={() => retry()}>Попробовать еще раз</button>
    </>
  );
}
