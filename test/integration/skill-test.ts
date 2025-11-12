/**
 * Sequential Thinking Skill Integration Tests
 *
 * MCP 서버와 독립적으로 Skill 구현체를 테스트합니다.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  validateThought,
  normalizeThought as _normalizeThought,
  processThought,
  createSessionState
} from '../../helpers/sequential-thinking';
import { formatThought } from '../../helpers/formatters';

describe('Sequential Thinking Skill Integration', () => {
  const skillMdPath = join(__dirname, '../../SKILL.md');

  describe('SKILL.md 파일 검증', () => {
    test('SKILL.md 파일이 존재해야 함', () => {
      const skillMd = readFileSync(skillMdPath, 'utf-8');
      expect(skillMd).toBeTruthy();
      expect(skillMd.length).toBeGreaterThan(0);
    });

    test('YAML 프론트매터가 올바른 형식이어야 함', () => {
      const skillMd = readFileSync(skillMdPath, 'utf-8');
      const frontmatterMatch = skillMd.match(/^---\n(.*?)\n---/s);

      expect(frontmatterMatch).toBeTruthy();

      const frontmatter = frontmatterMatch?.[1] || '';
      expect(frontmatter).toContain('name:');
      expect(frontmatter).toContain('description:');
    });

    test('자동 활성화 키워드가 명시되어 있어야 함', () => {
      const skillMd = readFileSync(skillMdPath, 'utf-8');

      // 자동 활성화 관련 섹션 확인
      expect(skillMd).toContain('단계별로');
      expect(skillMd).toContain('체계적으로');
      expect(skillMd).toContain('분석');
    });

    test('TodoWrite 통합 가이드가 포함되어야 함', () => {
      const skillMd = readFileSync(skillMdPath, 'utf-8');

      expect(skillMd).toContain('TodoWrite');
      expect(skillMd).toContain('💭');  // 일반 생각 아이콘
      expect(skillMd).toContain('🌿');  // 분기 아이콘
      expect(skillMd).toContain('✏️');  // 수정 아이콘
    });

    test('ThoughtData 구조가 문서화되어 있어야 함', () => {
      const skillMd = readFileSync(skillMdPath, 'utf-8');

      expect(skillMd).toContain('thought');
      expect(skillMd).toContain('thoughtNumber');
      expect(skillMd).toContain('totalThoughts');
      expect(skillMd).toContain('nextThoughtNeeded');
    });
  });

  describe('TodoWrite 형식 출력 검증', () => {
    test('일반 생각이 올바른 TodoWrite 형식으로 변환됨', () => {
      const result = formatThought({
        thought: '문제의 핵심 요구사항 파악',
        thoughtNumber: 1,
        totalThoughts: 5,
        nextThoughtNeeded: true
      }, { useEmoji: true });

      expect(result).toContain('💭');
      expect(result).toContain('Thought 1/5');
      expect(result).toContain('문제의 핵심 요구사항 파악');
    });

    test('분기된 생각이 브랜치 표시를 포함해야 함', () => {
      const result = formatThought({
        thought: '성능 최적화 접근법',
        thoughtNumber: 3,
        totalThoughts: 8,
        branchId: 'performance',
        branchFromThought: 2,
        nextThoughtNeeded: true
      }, { useEmoji: true });

      expect(result).toContain('🌿');
      expect(result).toContain('Branch');
      expect(result).toContain('performance');
    });

    test('수정된 생각이 수정 표시를 포함해야 함', () => {
      const result = formatThought({
        thought: 'PostgreSQL로 재평가',
        thoughtNumber: 4,
        totalThoughts: 8,
        isRevision: true,
        revisesThought: 3,
        nextThoughtNeeded: true
      }, { useEmoji: true });

      expect(result).toContain('✏️');
      expect(result).toContain('Revision');
      expect(result).toContain('revises #3');
    });

    test('완료된 생각이 완료 표시를 포함해야 함', () => {
      const result = formatThought({
        thought: '최종 권장사항 및 실행 계획',
        thoughtNumber: 5,
        totalThoughts: 5,
        nextThoughtNeeded: false
      }, { useEmoji: true });

      expect(result).toContain('✅');
      expect(result).toContain('Complete');
    });
  });

  describe('사고 프로세스 시뮬레이션', () => {
    test('기본 단계적 사고 워크플로우', () => {
      const sessionState = createSessionState();

      // Thought 1
      const result1 = processThought({
        thought: '문제 정의',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      }, { sessionState });

      expect(result1.success).toBe(true);
      expect(result1.thoughtNumber).toBe(1);
      expect(sessionState.thoughtHistory).toHaveLength(1);

      // Thought 2
      const result2 = processThought({
        thought: '해결책 탐색',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true
      }, { sessionState });

      expect(result2.success).toBe(true);
      expect(sessionState.thoughtHistory).toHaveLength(2);

      // Thought 3 (완료)
      const result3 = processThought({
        thought: '최종 결론',
        thoughtNumber: 3,
        totalThoughts: 3,
        nextThoughtNeeded: false
      }, { sessionState });

      expect(result3.success).toBe(true);
      expect(result3.nextThoughtNeeded).toBe(false);
      expect(sessionState.thoughtHistory).toHaveLength(3);
    });

    test('분기 탐색 워크플로우', () => {
      const sessionState = createSessionState();

      // 초기 생각
      processThought({
        thought: '공통 요구사항 파악',
        thoughtNumber: 1,
        totalThoughts: 6,
        nextThoughtNeeded: true
      }, { sessionState });

      // Branch A
      const branchA = processThought({
        thought: 'MySQL 접근법',
        thoughtNumber: 2,
        totalThoughts: 6,
        branchId: 'mysql',
        branchFromThought: 1,
        nextThoughtNeeded: true
      }, { sessionState });

      expect(branchA.success).toBe(true);
      expect(sessionState.branches['mysql']).toBeDefined();

      // Branch B
      const branchB = processThought({
        thought: 'PostgreSQL 접근법',
        thoughtNumber: 2,
        totalThoughts: 6,
        branchId: 'postgresql',
        branchFromThought: 1,
        nextThoughtNeeded: true
      }, { sessionState });

      expect(branchB.success).toBe(true);
      expect(sessionState.branches['postgresql']).toBeDefined();
      expect(Object.keys(sessionState.branches)).toHaveLength(2);
    });

    test('수정 기능 워크플로우', () => {
      const sessionState = createSessionState();

      // 초기 생각
      processThought({
        thought: 'MySQL 선택',
        thoughtNumber: 3,
        totalThoughts: 5,
        nextThoughtNeeded: true
      }, { sessionState });

      // 수정
      const revision = processThought({
        thought: 'PostgreSQL로 재평가',
        thoughtNumber: 4,
        totalThoughts: 6,
        isRevision: true,
        revisesThought: 3,
        nextThoughtNeeded: true
      }, { sessionState });

      expect(revision.success).toBe(true);

      const revisions = sessionState.thoughtHistory.filter(t => t.isRevision);
      expect(revisions).toHaveLength(1);
      expect(revisions[0]?.revisesThought).toBe(3);
    });

    test('동적 확장 워크플로우', () => {
      const sessionState = createSessionState();

      // 초기 예상: 5단계
      processThought({
        thought: '초기 분석',
        thoughtNumber: 1,
        totalThoughts: 5,
        nextThoughtNeeded: true
      }, { sessionState });

      // 복잡도 발견 → 확장 필요
      processThought({
        thought: '복잡한 요구사항 발견',
        thoughtNumber: 5,
        totalThoughts: 5,
        needsMoreThoughts: true,
        nextThoughtNeeded: true
      }, { sessionState });

      // 확장된 단계
      const extended = processThought({
        thought: '추가 분석',
        thoughtNumber: 6,
        totalThoughts: 8,  // 확장됨
        nextThoughtNeeded: true
      }, { sessionState });

      expect(extended.success).toBe(true);
      expect(extended.totalThoughts).toBe(8);
      expect(sessionState.totalThoughts).toBe(8);
    });
  });

  describe('유효성 검증', () => {
    test('필수 필드 누락 시 에러', () => {
      const validation = validateThought({
        thought: '테스트',
        // thoughtNumber 누락
        totalThoughts: 5,
        nextThoughtNeeded: true
      });

      expect(validation.valid).toBe(false);
      expect(validation.errors).toBeDefined();
      expect(validation.errors?.some(e => e.includes('thoughtNumber')) ?? false).toBe(true);
    });

    test('빈 thought는 허용되지 않음', () => {
      const validation = validateThought({
        thought: '',
        thoughtNumber: 1,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });

      expect(validation.valid).toBe(false);
      expect(validation.errors).toBeDefined();
    });

    test('isRevision이 true이지만 revisesThought 없으면 경고', () => {
      const validation = validateThought({
        thought: '수정된 생각',
        thoughtNumber: 3,
        totalThoughts: 5,
        nextThoughtNeeded: true,
        isRevision: true
        // revisesThought 누락
      });

      expect(validation.valid).toBe(true);  // 유효하지만
      expect(validation.warnings).toBeDefined();  // 경고 발생
      expect(validation.warnings?.some(w => w.includes('revisesThought')) ?? false).toBe(true);
    });

    test('branchFromThought 있지만 branchId 없으면 경고', () => {
      const validation = validateThought({
        thought: '분기된 생각',
        thoughtNumber: 3,
        totalThoughts: 5,
        nextThoughtNeeded: true,
        branchFromThought: 2
        // branchId 누락
      });

      expect(validation.valid).toBe(true);
      expect(validation.warnings).toBeDefined();
      expect(validation.warnings?.some(w => w.includes('branchId')) ?? false).toBe(true);
    });
  });

  describe('E2E 시나리오', () => {
    test('복잡한 아키텍처 의사결정 시나리오', () => {
      const sessionState = createSessionState();

      // 시나리오: 마이크로서비스 vs 모놀리식 아키텍처 결정

      // 1. 문제 정의
      processThought({
        thought: '새로운 전자상거래 플랫폼 아키텍처 설계',
        thoughtNumber: 1,
        totalThoughts: 8,
        nextThoughtNeeded: true
      }, { sessionState });

      // 2. 요구사항 파악
      processThought({
        thought: '트래픽 예상: 일 10만 주문, 확장성 필수',
        thoughtNumber: 2,
        totalThoughts: 8,
        nextThoughtNeeded: true
      }, { sessionState });

      // 3a. Branch A: 마이크로서비스
      processThought({
        thought: '마이크로서비스 아키텍처 분석',
        thoughtNumber: 3,
        totalThoughts: 8,
        branchId: 'microservices',
        branchFromThought: 2,
        nextThoughtNeeded: true
      }, { sessionState });

      processThought({
        thought: '마이크로서비스 장점: 독립 배포, 확장성',
        thoughtNumber: 4,
        totalThoughts: 8,
        branchId: 'microservices',
        nextThoughtNeeded: true
      }, { sessionState });

      // 3b. Branch B: 모놀리식
      processThought({
        thought: '모놀리식 아키텍처 분석',
        thoughtNumber: 3,
        totalThoughts: 8,
        branchId: 'monolithic',
        branchFromThought: 2,
        nextThoughtNeeded: true
      }, { sessionState });

      processThought({
        thought: '모놀리식 장점: 단순성, 빠른 개발',
        thoughtNumber: 4,
        totalThoughts: 8,
        branchId: 'monolithic',
        nextThoughtNeeded: true
      }, { sessionState });

      // 브랜치 검증
      expect(Object.keys(sessionState.branches)).toHaveLength(2);
      expect(sessionState.branches['microservices']).toBeDefined();
      expect(sessionState.branches['monolithic']).toBeDefined();

      // 5. 비교 분석
      processThought({
        thought: '두 접근법 비교: 팀 규모, 초기 복잡도 고려',
        thoughtNumber: 5,
        totalThoughts: 8,
        nextThoughtNeeded: true
      }, { sessionState });

      // 6. 초기 권장사항
      processThought({
        thought: '모놀리식으로 시작 권장',
        thoughtNumber: 6,
        totalThoughts: 8,
        nextThoughtNeeded: true
      }, { sessionState });

      // 7. 새로운 정보 발견 → 수정
      processThought({
        thought: '하이브리드 접근: 모놀리식 시작, 점진적 마이크로서비스 전환',
        thoughtNumber: 7,
        totalThoughts: 8,
        isRevision: true,
        revisesThought: 6,
        nextThoughtNeeded: true
      }, { sessionState });

      // 8. 최종 결론
      const final = processThought({
        thought: '최종 권장: 모듈식 모놀리식 → 점진적 분리 전략',
        thoughtNumber: 8,
        totalThoughts: 8,
        nextThoughtNeeded: false
      }, { sessionState });

      // 검증
      expect(final.success).toBe(true);
      expect(final.nextThoughtNeeded).toBe(false);
      expect(sessionState.thoughtHistory).toHaveLength(8);

      const revisions = sessionState.thoughtHistory.filter(t => t.isRevision);
      expect(revisions).toHaveLength(1);
    });
  });
});
