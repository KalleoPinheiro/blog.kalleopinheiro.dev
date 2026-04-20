# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm
RUN pnpm config set store-dir ~/.pnpm-store

# ============================================
# Build stage
# ============================================
FROM base AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prefer-offline

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm exec prisma generate

# Build application
RUN pnpm build

# ============================================
# Production stage
# ============================================
FROM base AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prefer-offline --prod && \
    pnpm exec prisma generate

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["pnpm", "start"]
