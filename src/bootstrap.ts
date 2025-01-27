import { container, tags } from '@/shared/lib/di';
import '@/app/styles/globals.css';

container.inject(tags.router);
container.inject(tags.viewModels);
container.inject(tags.theme);
