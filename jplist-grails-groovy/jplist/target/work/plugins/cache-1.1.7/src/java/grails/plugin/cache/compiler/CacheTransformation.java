/* Copyright 2012-2013 SpringSource.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package grails.plugin.cache.compiler;

import grails.util.CollectionUtils;

import java.util.Map;

import org.codehaus.groovy.ast.ASTNode;
import org.codehaus.groovy.ast.AnnotatedNode;
import org.codehaus.groovy.ast.AnnotationNode;
import org.codehaus.groovy.ast.ClassNode;
import org.codehaus.groovy.ast.expr.Expression;
import org.codehaus.groovy.control.CompilePhase;
import org.codehaus.groovy.control.SourceUnit;
import org.codehaus.groovy.transform.ASTTransformation;
import org.codehaus.groovy.transform.GroovyASTTransformation;

/**
 * @author Jeff Brown
 */
@GroovyASTTransformation(phase = CompilePhase.CANONICALIZATION)
public class CacheTransformation implements ASTTransformation {

   @SuppressWarnings("unchecked")
   protected static final Map<ClassNode, ClassNode> GRAILS_ANNOTATION_CLASS_NODE_TO_SPRING_ANNOTATION_CLASS_NODE = CollectionUtils.<ClassNode, ClassNode>newMap(
   		new ClassNode(grails.plugin.cache.Cacheable.class),  new ClassNode(org.springframework.cache.annotation.Cacheable.class),
   		new ClassNode(grails.plugin.cache.CachePut.class),   new ClassNode(org.springframework.cache.annotation.CachePut.class),
   		new ClassNode(grails.plugin.cache.CacheEvict.class), new ClassNode(org.springframework.cache.annotation.CacheEvict.class));

	public void visit(final ASTNode[] astNodes, final SourceUnit sourceUnit) {
		final ASTNode firstNode = astNodes[0];
		final ASTNode secondNode = astNodes[1];
		if (!(firstNode instanceof AnnotationNode) || !(secondNode instanceof AnnotatedNode)) {
			throw new RuntimeException("Internal error: wrong types: " + firstNode.getClass().getName() +
					" / " + secondNode.getClass().getName());
		}

		final AnnotationNode grailsCacheAnnotationNode = (AnnotationNode) firstNode;
		final AnnotatedNode annotatedNode = (AnnotatedNode) secondNode;
		final AnnotationNode springCacheAnnotationNode = getCorrespondingSpringAnnotation(
				grailsCacheAnnotationNode);
		annotatedNode.addAnnotation(springCacheAnnotationNode);
	}

	protected AnnotationNode getCorrespondingSpringAnnotation(final AnnotationNode grailsCacheAnnotationNode) {
		final Map<String, Expression> grailsAnnotationMembers = grailsCacheAnnotationNode.getMembers();

		final ClassNode springCacheAnnotationClassNode = GRAILS_ANNOTATION_CLASS_NODE_TO_SPRING_ANNOTATION_CLASS_NODE.get(
				grailsCacheAnnotationNode.getClassNode());
		final AnnotationNode springCacheAnnotationNode = new AnnotationNode(springCacheAnnotationClassNode);
		for (Map.Entry<String, Expression> entry : grailsAnnotationMembers.entrySet()) {
			springCacheAnnotationNode.addMember(entry.getKey(), entry.getValue());
		}
		return springCacheAnnotationNode;
	}
}
